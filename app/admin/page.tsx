import Logo from "@/components/Logo";
import StatCard from "@/components/StatCard";
import { getRecentAppointmentList } from "@/lib/actions/appointment.actions";
import Link from "next/link";
import React from "react";
import { columns } from "@/components/table/columns";
import { DataTable } from "@/components/table/DataTable";

const Admin = async () => {
  const appointments = await getRecentAppointmentList();

  return (
    <div className="mx-auto flex max-w-7xl flex-col space-y-14">
      <header className="admin-header">
        <Link href="/patients" className="cursor-pointer">
          <Logo w="w-[32px]" h="h-[32px]" />
        </Link>

        <p className="text-16-semibold">Admin Dashboard</p>
      </header>

      {appointments?.documents?.length > 0 && (
        <main className="admin-main">
          <section className="w-full space-y-4">
            <h1 className="header">Welcome 👋</h1>
            <p className="text-dark-700">
              Start the day with managing new appointments
            </p>
          </section>

          <section className="admin-stat">
            <StatCard
              type="appointments"
              count={appointments.appointments}
              label="Scheduled Appointments"
              icon="/assets/icons/appointments.svg"
            />

            <StatCard
              type="pending"
              count={appointments.pending}
              label="Pending Appointments"
              icon="/assets/icons/pending.svg"
            />

            <StatCard
              type="cancelled"
              count={appointments.cancelled}
              label="Cancelled Appointments"
              icon="/assets/icons/cancelled.svg"
            />
          </section>

          {appointments?.documents?.length > 0 && (
            <DataTable columns={columns} data={appointments.documents} />
          )}
        </main>
      )}
    </div>
  );
};

export default Admin;
