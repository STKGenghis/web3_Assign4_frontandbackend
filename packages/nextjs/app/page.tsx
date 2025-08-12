"use client";

import Link from "next/link";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Logo } from "~~/components/Logo";
import { Address } from "~~/components/scaffold-eth";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();

  return (
    <section className="flex items-center flex-col flex-grow pt-10">
      <div className="px-5 flex flex-col gap-2 items-center">
        <h1 className="text-center">
          <span className="block text-base mb-2">Welcome to</span>
          <span className="flex items-end gap-4 text-5xl font-bold">
            <Logo size={48} /> BaseFlow Inventory{" "}
          </span>
        </h1>
        <div className="flex btn btn-md bg-base-100 w-fit justify-center mb-4 items-center space-x-2">
          <p className="my-2 font-medium">Connected Address:</p>
          <Address address={connectedAddress} />
        </div>
        <p className="text-center text-lg">
          BaseFlow is a blockchain-based inventory management and invoicing system
        </p>
        <p className="text-center text-base mt-2">
          Navigate through the menu to access:
        </p>
        <div className="flex flex-wrap gap-4 justify-center mt-4">
          <Link href="/dashboard" className="btn btn-primary">Dashboard</Link>
          <Link href="/inventory" className="btn btn-secondary">Inventory</Link>
          <Link href="/sales" className="btn btn-accent">Sales</Link>
        </div>
      </div>

      <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12">
        <div className="flex justify-center items-center gap-12 flex-col sm:flex-row">
          <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
            <BugAntIcon className="h-8 w-8" />
            <h3 className="text-xl font-bold mt-4">Inventory Management</h3>
            <p className="mt-2">
              Track and manage your inventory items with real-time blockchain updates.
              <br />
              <Link href="/inventory" passHref className="link link-primary mt-2 inline-block">
                Go to Inventory
              </Link>
            </p>
          </div>
          <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
            <MagnifyingGlassIcon className="h-8 w-8" />
            <h3 className="text-xl font-bold mt-4">Sales & Invoicing</h3>
            <p className="mt-2">
              Create and manage sales invoices with secure blockchain transactions.
              <br />
              <Link href="/sales" passHref className="link link-primary mt-2 inline-block">
                Manage Sales
              </Link>
            </p>
          </div>
        </div>
        <div className="flex justify-center mt-8">
          <Link href="/debug" className="btn btn-outline">
            Debug Contracts
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Home;
