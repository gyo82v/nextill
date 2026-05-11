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
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Stock</h1>
        <p>Description here</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:items-start lg:gap-10 xl:gap-14">
        <div className="order-1 self-start h-fit min-w-0 md:col-start-1 md:row-start-1 max-w-2xl">
          <AddStockItemForm uid={user.uid} />
        </div>

        <div className="order-2 min-w-0 md:col-start-2 md:row-start-1 md:row-span-2 max-w-2xl">
          <StockList uid={user.uid} items={items} loading={loading} />
        </div>


        <div className="order-3 min-w-0 md:col-start-1 md:row-start-2 max-w-2xl">
          <StockActivityList
            activity={activity}
            onDelete={handleDeleteActivity}
            onClearAll={handleClearActivity}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}


/*

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


export default function StockPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<StockItem[]>([]);
  const [activity, setActivity] = useState<StockActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    setLoading(true);

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
    // no reload needed 🎉
  }

  async function handleClearActivity() {
    if (!user) return;
    if (!confirm("Clear all stock activity?")) return;
    await clearStockActivity(user.uid);
    // no reload needed 🎉
  }

  if (!user) return null;

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Stock</h1>
        <p>Description here</p>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:items-start">

    <div className="order-1 md:col-start-1 md:row-start-1 self-start h-fit min-w-0">
      <AddStockItemForm uid={user.uid} />
    </div>


    <div className="order-2 md:col-start-2 md:row-start-1 md:row-span-2 min-w-0">
      <StockList uid={user.uid} items={items} loading={loading} />
    </div>


    <div className="order-3 md:col-start-1 md:row-start-2 min-w-0">
      <StockActivityList
        activity={activity}
        onDelete={handleDeleteActivity}
        onClearAll={handleClearActivity}
        loading={loading}
      />
    </div>
  </div>

      
  
    </div>
  );
}





*/

