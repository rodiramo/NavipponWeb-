import React from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { useDataTable } from "../../../../hooks/useDataTable";
import {
  deleteUser,
  getAllUsers,
  updateProfile,
} from "../../../../services/index/users";
import { Link } from "react-router-dom";

import DataTable from "../../components/DataTable";
import { images, stables } from "../../../../constants";
import useUser from "../../../../hooks/useUser";
import { BsCheckLg } from "react-icons/bs";
import { AiOutlineClose } from "react-icons/ai";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
const Users = () => {
  const { jwt } = useUser();
  const queryClient = useQueryClient();

  // Mutation for updating admin status
  const { mutate: mutateUpdateUser, isLoading: isLoadingUpdateUser } =
    useMutation({
      mutationFn: ({ isAdmin, userId }) =>
        updateProfile({ token: jwt, userData: { admin: isAdmin }, userId }),
      onSuccess: () => {
        queryClient.invalidateQueries(["users"]);
        toast.success("Usuario actualizado");
      },
      onError: (error) => {
        toast.error(error.message);
        console.log(error);
      },
    });

  // Mutation for updating verified status
  const { mutate: mutateUpdateVerified, isLoading: isLoadingUpdateVerified } =
    useMutation({
      mutationFn: ({ isVerified, userId }) =>
        updateProfile({
          token: jwt,
          userData: { verified: isVerified },
          userId,
        }),
      onSuccess: () => {
        queryClient.invalidateQueries(["users"]);
        toast.success("Estado de verificación actualizado");
      },
      onError: (error) => {
        toast.error(error.message);
        console.log(error);
      },
    });

  // Admin toggle is still a dropdown; you can keep or change it.
  const handleAdminToggle = (userItem) => {
    const newStatus = !userItem.admin;
    if (
      window.confirm(
        "¿Quieres cambiar el estado de administrador de este usuario?"
      )
    ) {
      mutateUpdateUser({ isAdmin: newStatus, userId: userItem._id });
    }
  };

  // Verified toggle function
  const handleVerifiedToggle = (userItem) => {
    const newStatus = !userItem.verified;
    if (
      window.confirm(
        "¿Quieres cambiar el estado de verificación de este usuario?"
      )
    ) {
      mutateUpdateVerified({ isVerified: newStatus, userId: userItem._id });
    }
  };

  const {
    currentPage,
    searchKeyword,
    data: usersData,
    isLoading,
    isFetching,
    isLoadingDeleteData,
    searchKeywordHandler,
    submitSearchKeywordHandler,
    deleteDataHandler,
    setCurrentPage,
  } = useDataTable({
    dataQueryFn: () => getAllUsers(jwt, searchKeyword, currentPage),
    dataQueryKey: "users",
    deleteDataMessage: "Usuario eliminado",
    mutateDeleteFn: ({ slug, token }) => deleteUser({ slug, token }),
  });

  return (
    <DataTable
      pageTitle=""
      dataListName="Administrar Usuarios"
      searchInputPlaceHolder="Email del usuario..."
      searchKeywordOnSubmitHandler={submitSearchKeywordHandler}
      searchKeywordOnChangeHandler={searchKeywordHandler}
      searchKeyword={searchKeyword}
      tableHeaderTitleList={[
        "Nombre",
        "Email",
        "Creado",
        "Verificado",
        "Es Admin",
        "Acciones",
      ]}
      isLoading={isLoading}
      isFetching={isFetching}
      data={usersData?.data}
      setCurrentPage={setCurrentPage}
      currentPage={currentPage}
      headers={usersData?.headers}
    >
      {usersData?.data.map((userItem) => (
        <tr
          key={userItem._id}
          className="bg-white hover:shadow-md transition-shadow rounded-lg"
        >
          {/* Name & Avatar */}
          <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <a href="/" className="block">
                  <img
                    src={
                      userItem?.avatar
                        ? stables.UPLOAD_FOLDER_BASE_URL + userItem?.avatar
                        : images.userImage
                    }
                    alt={userItem.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </a>
              </div>
              <div className="ml-4">
                <Link
                  to={`/profile/${userItem._id}`}
                  className="whitespace-nowrap"
                >
                  {userItem.name}
                </Link>
              </div>
            </div>
          </td>
          {/* Email */}
          <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200">
            <p className="text-gray-900 whitespace-nowrap">{userItem.email}</p>
          </td>
          {/* Created Date */}
          <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200">
            <p className="text-gray-900 whitespace-nowrap">
              {new Date(userItem.createdAt).toLocaleDateString("en-US", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>
          </td>
          {/* Verified Toggle */}
          <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200">
            <button
              onClick={() => handleVerifiedToggle(userItem)}
              className="focus:outline-none"
              disabled={isLoadingUpdateVerified}
            >
              <span
                className={`w-12 h-12 flex items-center justify-center rounded-full ${
                  userItem.verified ? "bg-green-200" : "bg-red-200"
                }`}
              >
                {userItem.verified ? (
                  <BsCheckLg className="text-green-700 text-xl" />
                ) : (
                  <AiOutlineClose className="text-red-700 text-xl" />
                )}
              </span>
            </button>
          </td>
          {/* Admin Dropdown */}
          <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200">
            <select
              value={userItem.admin ? "admin" : "user"}
              onChange={(e) => handleAdminToggle(userItem)}
              disabled={isLoadingUpdateUser}
              className="rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm"
            >
              <option value="user">Usuario Regular</option>
              <option value="admin">Administrador</option>
            </select>
          </td>
          {/* Actions (Delete) */}
          <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200">
            <button
              disabled={isLoadingDeleteData}
              type="button"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                borderRadius: "4px",
                padding: "0.5rem 1rem",
              }}
              className="text-red-600 border border-red-600 hover:text-red-900 hover:border-red-900  disabled:opacity-70 disabled:cursor-not-allowed"
              onClick={() =>
                deleteDataHandler({ slug: userItem._id, token: jwt })
              }
            >
              <Trash2 size={16} />
              Borrar
            </button>{" "}
          </td>
        </tr>
      ))}
    </DataTable>
  );
};

export default Users;
