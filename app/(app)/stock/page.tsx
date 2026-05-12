"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/firebase/authProvider";
import {
  subscribeStockItems,
  subscribeStockActivity,
  deleteStockActivity,
  clearStockActivity,
} from "@/firebase/stock";
import AddStockItemForm from "@/components/stock/AddStockItemForm";
import StockList from "@/components/stock/StockList";
import StockActivityList from "@/components/stock/StockActivityList";
import type { StockItem, StockActivity } from "@/types";
import { MenuSectionDivider } from "@/components/ui/dividers/Dividers";
import { DotLineDivider } from "@/components/ui/dividers/Dividers";


export default function StockPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<StockItem[]>([]);
  const [activity, setActivity] = useState<StockActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const unsubItems = subscribeStockItems(user.uid, (items) => {
      setItems(items);
      setLoading(false);
    });

    const unsubActivity = subscribeStockActivity(user.uid, (activity) => {
      setActivity(activity);
    });

    return () => {
      unsubItems();
      unsubActivity();
    };
  }, [user]);

  async function handleDeleteActivity(id: string) {
    if (!user) return;
    await deleteStockActivity(user.uid, id);
  }

  async function handleClearActivity() {
    if (!user) return;
    if (!confirm("Clear all stock activity?")) return;
    await clearStockActivity(user.uid);
  }

  if (!user) return null;

  return (
    <div className="w-full px-4 py-14 sm:px-6 lg:px-8 lg:py-16 ">
      <div className="relative grid w-full grid-cols-1 gap-14 lg:grid-cols-2 lg:items-start ">

        <section className="flex w-full justify-center ">
          <div className="w-full max-w-2xl">
            <div className="mb-10 sm:mb-6 lg:mb-10">
              <h1 className="text-2xl font-semibold tracking-tight">
                title
              </h1>
              <p className="mt-1 text-sm text-muted xl:max-w-[80%]">
                description
              </p>
            </div>

            <AddStockItemForm uid={user.uid} />

            <DotLineDivider className="my-14" />

            <div className="lg:hidden ">
               <StockList uid={user.uid} items={items} loading={loading} />
            </div>

            <div className="hidden lg:block">
              <StockActivityList
                activity={activity}
                onDelete={handleDeleteActivity}
                onClearAll={handleClearActivity}
                loading={loading}
              />
            </div>
          </div>
        </section>

        <MenuSectionDivider />

        <section className="flex w-full justify-center ">
          <div className="w-full max-w-2xl">
            <div className="mb-10 sm:mb-6 lg:mb-10">
              <h2 className="text-2xl font-semibold tracking-tight">
                title
              </h2>
              <p className="mt-1 text-sm text-muted">
                  description
              </p>
            </div>

            <div className="hidden lg:block">
              <StockList uid={user.uid} items={items} loading={loading} />
            </div>

            <div className="lg:hidden">
              <StockActivityList
                activity={activity}
                onDelete={handleDeleteActivity}
                onClearAll={handleClearActivity}
                loading={loading}
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}


/*


 







*/

