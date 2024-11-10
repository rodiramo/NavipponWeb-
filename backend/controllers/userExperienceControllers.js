import { uploadPicture } from "../middleware/uploadPictureMiddleware";
import Experience from "../models/Experience";
import Review from "../models/Review";
import { fileRemover } from "../utils/fileRemover";
import { v4 as uuidv4 } from "uuid";

const createExperience = async (req, res, next) => {
    try {
        const { title, caption, body, photo, categories, tags } = req.body;
        const experience = new Experience({
            title: title || "sample title",
            caption: caption || "sample caption",
            slug: uuidv4(),
            body: body || { type: "doc", content: [] },
            photo: photo || "",
            user: req.user._id,
            categories: categories || "Hoteles", 
            tags: tags || [],
        });

        const createdExperience = await experience.save();
        return res.json(createdExperience);
    } catch (error) {
        next(error);
    }
};

const updateExperience = async (req, res, next) => {
    try {
        const experience = await Experience.findOne({ slug: req.params.slug });

        if (!experience) {
            const error = new Error("Experiencia no encontrada");
            next(error);
            return;
        }

        // Verifica que el usuario autenticado es el propietario de la experiencia
        if (experience.user.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error("No autorizado");
        }

        const upload = uploadPicture.single("experiencePicture");

        const handleUpdateExperienceData = async (data) => {
            const { title, caption, slug, body, tags, categories } = JSON.parse(data);
            experience.title = title || experience.title;
            experience.caption = caption || experience.caption;
            experience.slug = slug || experience.slug;
            experience.body = body || experience.body;    
            experience.tags = tags || experience.tags;
            experience.categories = categories || experience.categories;
            const updatedExperience = await experience.save();
            return res.json(updatedExperience);
        };

        upload(req, res, async function (err) {
            if (err) {
                const error = new Error(
                    "Se produjo un error desconocido al cargar " + err.message
                );
                next(error);
            } else {
                if (req.file) {
                    let filename;
                    filename = experience.photo;
                    if (filename) {
                        fileRemover(filename);
                    }
                    experience.photo = req.file.filename;
                    handleUpdateExperienceData(req.body.document);
                } else {
                    let filename;
                    filename = experience.photo;
                    experience.photo = "";
                    fileRemover(filename);
                    handleUpdateExperienceData(req.body.document);
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

const deleteExperience = async (req, res, next) => {
    try {
        const experience = await Experience.findOneAndDelete({ slug: req.params.slug });

        if (!experience) {
            const error = new Error("Experiencia no encontrada");
            return next(error);
        }

        // Verifica que el usuario autenticado es el propietario de la experiencia
        if (experience.user.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error("No autorizado");
        }

        fileRemover(experience.photo);

        await Review.deleteMany({ experience: experience._id });

        return res.json({
            message: "Experiencia eliminada con éxito",
        });
    } catch (error) {
        next(error);
    }
};

const getUserExperiences = async (req, res, next) => {
    try {
        const filter = req.query.searchKeyword;
        let where = { user: req.user._id };
        if (filter) {
            where.title = { $regex: filter, $options: "i" };
        }
        let query = Experience.find(where);
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * pageSize;
        const total = await Experience.find(where).countDocuments();
        const pages = Math.ceil(total / pageSize);

        res.header({
            "x-filter": filter,
            "x-totalcount": JSON.stringify(total),
            "x-currentpage": JSON.stringify(page),
            "x-pagesize": JSON.stringify(pageSize),
            "x-totalpagecount": JSON.stringify(pages),
        });

        if (page > pages) {
            return res.json([]);
        }

        const result = await query
            .skip(skip)
            .limit(pageSize)
            .populate([
                {
                    path: "user",
                    select: ["avatar", "name", "verified"],
                },
            ])
            .sort({ updatedAt: "desc" });

        return res.json(result);
    } catch (error) {
        next(error);
    }
};

// Añadir la función para obtener una experiencia específica
const getSingleUserExperience = async (req, res, next) => {
    try {
        const experience = await Experience.findOne({ slug: req.params.slug, user: req.user._id });
        if (!experience) {
            return res.status(404).json({ message: "Experiencia no encontrada" });
        }
        res.json(experience);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { createExperience, updateExperience, deleteExperience, getUserExperiences, getSingleUserExperience };