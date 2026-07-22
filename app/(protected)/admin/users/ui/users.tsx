'use client';

import Link from 'next/link';
import { changeUserRole } from '@/app/actions/users/changeUserRole';
import { User } from '@/interfaces/user.interface';
import { toast } from 'sonner';

interface Props {
  users: User[];
}

export const Users = ({ users }: Props) => {
  const handleChangeRole = async (id: string, email: string, role: string) => {
    const { success } = await changeUserRole(id, role);
    if (success) {
      toast.success(<div>{`Role for ${email} was changed.`}</div>);
    }
  };

  return (
    <table className="min-w-full">
      <thead className="border-b border-gray-200 bg-gray-200">
        <tr>
          <th scope="col" className="px-6 py-4 text-left text-sm font-medium text-gray-900">
            Email
          </th>
          <th scope="col" className="px-6 py-4 text-left text-sm font-medium text-gray-900">
            Name
          </th>
          <th scope="col" className="px-6 py-4 text-left text-sm font-medium text-gray-900">
            Role
          </th>
        </tr>
      </thead>
      <tbody>
        {!users?.length ? (
          <tr className="border-b border-gray-200 bg-white transition duration-300 ease-in-out hover:bg-gray-100">
            <td
              colSpan={4}
              className="text-center px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900"
            >
              <p>There's not users registerd yet.</p>
            </td>
          </tr>
        ) : (
          users.map((user) => (
            <tr
              key={user.email}
              className="border-b border-gray-200 bg-white transition duration-300 ease-in-out hover:bg-gray-100"
            >
              <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900">
                <Link href={`/admin/orders/${user.id}`}>{user.email}</Link>
              </td>
              <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900">
                {user.name}
              </td>
              <td className="px-6 py-4 text-sm font-light whitespace-nowrap text-gray-900">
                <select
                  value={user.role}
                  onChange={(e) => handleChangeRole(user.id, user.email, e.target.value)}
                  className="p-2 text-sm text-gray-900 w-full"
                >
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
};
