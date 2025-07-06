import asyncHandler from "express-async-handler";
import { Checklist } from "../models/Checklist.js";
import mongoose from "mongoose";

const getUserChecklist = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { page = 1, limit = 50, category, priority, completed } = req.query;

  // Verify user can access this checklist
  if (req.user._id.toString() !== userId) {
    res.status(403);
    throw new Error("No tienes acceso a esta lista");
  }

  // Build filter object
  const filter = { userId };

  if (category && category !== "all") {
    filter.category = category;
  }

  if (priority && priority !== "all") {
    filter.priority = priority;
  }

  if (completed !== undefined) {
    filter.checked = completed === "true";
  }

  try {
    // Get total count for pagination
    const total = await Checklist.countDocuments(filter);

    // Get checklist items with pagination
    const checklistItems = await Checklist.find(filter)
      .sort({ order: 1, createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate("userId", "name email");

    // Calculate stats
    const stats = await Checklist.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          completed: {
            $sum: { $cond: [{ $eq: ["$checked", true] }, 1, 0] },
          },
          highPriority: {
            $sum: { $cond: [{ $eq: ["$priority", "high"] }, 1, 0] },
          },
          overdue: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $ne: ["$dueDate", null] },
                    { $lt: ["$dueDate", new Date()] },
                    { $eq: ["$checked", false] },
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
    ]);

    const checklistStats = stats[0] || {
      total: 0,
      completed: 0,
      highPriority: 0,
      overdue: 0,
    };

    res.status(200).json({
      checklistItems,
      stats: checklistStats,
      pagination: {
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        total,
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    res.status(500);
    throw new Error("Error al obtener la lista: " + error.message);
  }
});

// @desc Create new checklist item
// @route POST /api/checklist
// @access Private
const createChecklistItem = asyncHandler(async (req, res) => {
  const { userId, text, priority, category, dueDate } = req.body;

  // Verify user can create items for this user
  if (req.user._id.toString() !== userId) {
    res.status(403);
    throw new Error("No tienes permisos para crear elementos en esta lista");
  }

  // Validation
  if (!text || text.trim().length === 0) {
    res.status(400);
    throw new Error("El texto de la tarea es requerido");
  }

  if (text.length > 200) {
    res.status(400);
    throw new Error("El texto de la tarea no puede exceder 200 caracteres");
  }

  try {
    // Get the highest order number for proper ordering
    const lastItem = await Checklist.findOne({ userId })
      .sort({ order: -1 })
      .select("order");

    const newOrder = lastItem ? lastItem.order + 1 : 0;

    const checklistItem = await Checklist.create({
      userId,
      text: text.trim(),
      priority: priority || "medium",
      category: category || "other",
      dueDate: dueDate || null,
      order: newOrder,
    });

    // Populate user data
    await checklistItem.populate("userId", "name email");

    res.status(201).json(checklistItem);
  } catch (error) {
    res.status(500);
    throw new Error("Error al crear la tarea: " + error.message);
  }
});

// @desc Update checklist item
// @route PUT /api/checklist/:itemId
// @access Private
const updateChecklistItem = asyncHandler(async (req, res) => {
  const { itemId } = req.params;
  const { text, checked, priority, category, dueDate, order } = req.body;

  try {
    const checklistItem = await Checklist.findById(itemId);

    if (!checklistItem) {
      res.status(404);
      throw new Error("Elemento no encontrado");
    }

    // Verify user owns this item
    if (checklistItem.userId.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error("No tienes permisos para editar este elemento");
    }

    // Update fields
    if (text !== undefined) {
      if (!text || text.trim().length === 0) {
        res.status(400);
        throw new Error("El texto de la tarea es requerido");
      }
      if (text.length > 200) {
        res.status(400);
        throw new Error("El texto de la tarea no puede exceder 200 caracteres");
      }
      checklistItem.text = text.trim();
    }

    if (checked !== undefined) {
      checklistItem.checked = checked;
    }

    if (priority !== undefined) {
      checklistItem.priority = priority;
    }

    if (category !== undefined) {
      checklistItem.category = category;
    }

    if (dueDate !== undefined) {
      checklistItem.dueDate = dueDate;
    }

    if (order !== undefined) {
      checklistItem.order = order;
    }

    const updatedItem = await checklistItem.save();
    await updatedItem.populate("userId", "name email");

    res.status(200).json(updatedItem);
  } catch (error) {
    if (
      error.message.includes("requerido") ||
      error.message.includes("exceder")
    ) {
      throw error;
    }
    res.status(500);
    throw new Error("Error al actualizar la tarea: " + error.message);
  }
});

// @desc Delete checklist item
// @route DELETE /api/checklist/:itemId
// @access Private
const deleteChecklistItem = asyncHandler(async (req, res) => {
  const { itemId } = req.params;

  try {
    const checklistItem = await Checklist.findById(itemId);

    if (!checklistItem) {
      res.status(404);
      throw new Error("Elemento no encontrado");
    }

    // Verify user owns this item
    if (checklistItem.userId.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error("No tienes permisos para eliminar este elemento");
    }

    await Checklist.findByIdAndDelete(itemId);

    res.status(200).json({
      message: "Tarea eliminada exitosamente",
      deletedItem: checklistItem,
    });
  } catch (error) {
    if (
      error.message.includes("encontrado") ||
      error.message.includes("permisos")
    ) {
      throw error;
    }
    res.status(500);
    throw new Error("Error al eliminar la tarea: " + error.message);
  }
});

// @desc Bulk update checklist items (for reordering)
// @route PUT /api/checklist/bulk-update
// @access Private
const bulkUpdateChecklistItems = asyncHandler(async (req, res) => {
  const { items } = req.body; // Array of {id, order, checked}

  if (!Array.isArray(items) || items.length === 0) {
    res.status(400);
    throw new Error("Se requiere un array de elementos válido");
  }

  try {
    const updates = [];

    for (const item of items) {
      if (!item.id) continue;

      // Verify user owns this item
      const checklistItem = await Checklist.findById(item.id);
      if (
        !checklistItem ||
        checklistItem.userId.toString() !== req.user._id.toString()
      ) {
        continue;
      }

      const updateData = {};
      if (item.order !== undefined) updateData.order = item.order;
      if (item.checked !== undefined) updateData.checked = item.checked;

      if (Object.keys(updateData).length > 0) {
        updates.push({
          updateOne: {
            filter: { _id: item.id },
            update: updateData,
          },
        });
      }
    }

    if (updates.length > 0) {
      await Checklist.bulkWrite(updates);
    }

    res.status(200).json({
      message: "Elementos actualizados exitosamente",
      updatedCount: updates.length,
    });
  } catch (error) {
    res.status(500);
    throw new Error("Error en actualización masiva: " + error.message);
  }
});

// @desc Get checklist statistics
// @route GET /api/checklist/:userId/stats
// @access Private
const getChecklistStats = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  // Verify user can access these stats
  if (req.user._id.toString() !== userId) {
    res.status(403);
    throw new Error("No tienes acceso a estas estadísticas");
  }

  try {
    const stats = await Checklist.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $facet: {
          overview: [
            {
              $group: {
                _id: null,
                total: { $sum: 1 },
                completed: {
                  $sum: { $cond: [{ $eq: ["$checked", true] }, 1, 0] },
                },
                pending: {
                  $sum: { $cond: [{ $eq: ["$checked", false] }, 1, 0] },
                },
              },
            },
          ],
          byPriority: [
            {
              $group: {
                _id: "$priority",
                count: { $sum: 1 },
                completed: {
                  $sum: { $cond: [{ $eq: ["$checked", true] }, 1, 0] },
                },
              },
            },
          ],
          byCategory: [
            {
              $group: {
                _id: "$category",
                count: { $sum: 1 },
                completed: {
                  $sum: { $cond: [{ $eq: ["$checked", true] }, 1, 0] },
                },
              },
            },
          ],
          recentActivity: [
            { $sort: { updatedAt: -1 } },
            { $limit: 5 },
            {
              $project: {
                text: 1,
                checked: 1,
                updatedAt: 1,
              },
            },
          ],
        },
      },
    ]);

    const result = stats[0];

    res.status(200).json({
      overview: result.overview[0] || { total: 0, completed: 0, pending: 0 },
      byPriority: result.byPriority,
      byCategory: result.byCategory,
      recentActivity: result.recentActivity,
      completionRate: result.overview[0]
        ? (
            (result.overview[0].completed / result.overview[0].total) *
            100
          ).toFixed(1)
        : 0,
    });
  } catch (error) {
    res.status(500);
    throw new Error("Error al obtener estadísticas: " + error.message);
  }
});

export {
  getUserChecklist,
  createChecklistItem,
  updateChecklistItem,
  deleteChecklistItem,
  bulkUpdateChecklistItems,
  getChecklistStats,
};
