"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/firebase/authProvider";
import {
  subscribeStockItems,
  subscribeStockActivity,
  deleteStockActivity,
  clearStockActivity,
  clearStockItems
} from "@/firebase/stock";
import AddStockItemForm from "@/components/stock/AddStockItemForm";
import StockList from "@/components/stock/StockList";
import StockActivityList from "@/components/stock/StockActivityList";
import type { StockItem, StockActivity } from "@/types";
import { MenuSectionDivider } from "@/components/ui/dividers/Dividers";
import { DotLineDivider } from "@/components/ui/dividers/Dividers";
import Button from "@/components/ui/Button";
import { useTranslation } from "react-i18next";


export default function StockPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<StockItem[]>([]);
  const [activity, setActivity] = useState<StockActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [clearStockLoading, setclearStockLoading] = useState(false)
  const [clearActivityLoading, setClearActivityLoading] = useState(false)
  const {t} = useTranslation("stock")

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
    try{
      setClearActivityLoading(true)
      await clearStockActivity(user.uid)
    }finally{
      setClearActivityLoading(false)
    }
  }

  async function handleClearStock(){
    if(!user) return
    try{
      setclearStockLoading(true)
      await clearStockItems(user.uid)
    }finally{
      setclearStockLoading(false)
    }
  }

  if (!user) return null;

  return (
    <div className="w-full px-4 py-14 sm:px-6 lg:px-8 lg:py-16 ">
      <div className="relative grid w-full grid-cols-1 gap-14 lg:grid-cols-2 lg:items-start ">

        <section className="flex w-full justify-center ">
          <div className="w-full max-w-2xl">
            <div className="mb-10 sm:mb-6 lg:mb-10">
              <h1 className="text-2xl font-semibold tracking-tight">
                {t("createSection.title")}
              </h1>
              <p className="mt-1 text-sm text-muted xl:max-w-[80%]">
                {t("createSection.description")}
              </p>
            </div>

            <AddStockItemForm uid={user.uid} />

            <DotLineDivider className="my-14" />

            {/* mobile/small screens*/}
            <div className={`mb-14 lg:hidden flex flex-col gap-6`}>
              <div className="flex-2 lg:flex-3 ">
                <h2 className="text-2xl font-semibold tracking-tight">
                  {t("stockSection.title")}
                </h2>
                <p className="mt-1 text-sm text-muted">
                  {t("stockSection.description")}
                </p>
              </div>

              <Button
                type="button"
                loading={clearStockLoading}
                className="flex-1 w-1/2 "
                onClick={handleClearStock}
              >
                {t("stockSection.clearStockItems")}
              </Button> 
            </div>

            <div className="lg:hidden ">
               <StockList uid={user.uid} items={items} />
            </div>
            {/*end mobile/small screens */}

            <div className="hidden lg:block">
              <StockActivityList
                activity={activity}
                onDelete={handleDeleteActivity}
                onClearAll={handleClearActivity}
                loadingClearActivity={clearActivityLoading}
              />
            </div>
          </div>
        </section>

        <MenuSectionDivider />

        <section className="flex w-full justify-center ">
          <div className="w-full max-w-2xl">
            {/* desktop screens */}
            <div className={`hidden  lg:flex lg:justify-between lg:items-center
                             lg:gap-8 xl:gap-10 lg:mb-10`}>
              <div className="flex-2 lg:flex-3 ">
                <h2 className="text-2xl font-semibold tracking-tight">
                  {t("stockSection.title")}
                </h2>
                <p className="mt-1 text-sm text-muted">
                  {t("stockSection.description")}
                </p>
              </div>

              <Button
                type="button"
                loading={clearStockLoading}
                className="flex-1 w-1/2 sm:w-auto"
                onClick={handleClearStock}
              >
                {t("stockSection.clearStockItems")}
              </Button> 
            </div>

            <div className="hidden lg:block">
              <StockList uid={user.uid} items={items}/>
            </div>
            {/*end desktop screens */}

            <div className="lg:hidden">
              <StockActivityList
                activity={activity}
                onDelete={handleDeleteActivity}
                onClearAll={handleClearActivity}
                loadingClearActivity={clearActivityLoading}
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}


/*

 <div className={`mb-14 sm:mb-6 hidden flex flex-col gap-6 sm:gap-4 lg:gap-8
                             xl:gap-10 lg:flex-row lg:justify-between lg::items-center lg:mb-10`}>
              <div className="flex-2 lg:flex-3 ">
                <h2 className="text-2xl font-semibold tracking-tight">
                  title 2
                </h2>
                <p className="mt-1 text-sm text-muted">
                  description
                </p>
              </div>

              <Button
                type="button"
                loading={clearStockLoading}
                className="flex-1 w-1/2 sm:w-auto"
                onClick={handleClearStock}
              >
                Clear Stock
              </Button> 
            </div>


 







*/

