import { redirect } from 'next/navigation';
import { getPaginatedUsers } from '@/app/actions/users/getPaginatedUsers';
import { auth } from '@/auth.config';
import { Pagination } from '@/components/ui/pagination/Pagination';
import { Title } from '@/components/ui/title/Title';
import { Users } from './ui/users';

interface Props {
  searchParams: {
    page?: string;
  };
}

const getPagination = async (page: number) => {
  return await getPaginatedUsers({ page: page });
};

export default async function ({ searchParams }: Props) {
  const session = await auth();
  if (session?.user.role !== 'admin') {
    redirect('/');
  }

  const { page } = await searchParams;
  const pageNumber = page ? parseInt(page) : 1;

  const { users, totalPages } = await getPagination(pageNumber);

  return (
    <>
      <Title title="Users mantainance" />
      <div className="mt-6 mb-20 overflow-hidden rounded-lg shadow-xl">
        <Users users={users || []} />
        {totalPages && totalPages > 1 && <Pagination totalPages={totalPages} />}
      </div>
    </>
  );
}
