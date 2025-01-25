'use client'

import { useState, useEffect } from "react";
import { CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "./components/ui/button"
import HorizontalCard from "./horizontal-card"
import yt_icon from "../public/YouTube_full-color_icon_(2017).svg"
import insta_icon from "../public/Instagram_logo_2016.svg"
import fb_icon from "../public/Facebook_f_logo_(2021).svg"
import linkedin_icon from "../public/LinkedIn_icon.svg"
import x_icon from "../public/X_logo_2023_original.svg"
import HorizontalCardWithButtons from "./horizontal-card-with-buttons"

export default function TabCard() {

  interface listElement {
    link: string;
    title: string;
  }

  const [list, setList] = useState<listElement[]>([]); 

  useEffect(() => {
    const fetchList = async () => {
      const keys = await chrome.storage.local.getKeys();
      let links = []
      for (let key of keys) {
        if (key.slice(0, 12) != "blocked_site") {
          const el = await chrome.storage.local.get(key)
          links.push({ link: key, title: el[key] })
        }
      }

      setList(links)
    }

    fetchList();
  }, [])

  const onclick = async () => {
    let [tab] = await chrome.tabs.query({ active: true });
    let key = String([tab.url!])
    chrome.storage.local.set({ [key]: tab.title })
    setList([...list, {link: key, title: tab.title!} ])
  }

  const ondelete = async (link: string | undefined) => {
    if (link) {
      await chrome.storage.local.remove(link);
      setList(list.filter((item) => item.link != link))
    }
  }

  const listItems = list.map(item => <HorizontalCardWithButtons link={item.link} title={item.title} action={ondelete}/>);

  return (
    <Tabs defaultValue="tab1" className="w-64 flex flex-col h-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="tab1">Reading List</TabsTrigger>
        <TabsTrigger value="tab2">Blocked Sites</TabsTrigger>
      </TabsList>
      <TabsContent value="tab1" className="flex-1">
        <CardContent className="mt-6 mb-3 px-0 py-0 flex-1">
          <div className="flex flex-col h-full">
            <Button onClick={onclick} size="lg">Add Page to Reading List</Button>
          </div>
        </CardContent>
        { listItems }    
      </TabsContent>
      <TabsContent value="tab2" className="flex-1">
        <h2 className="mt-6 mb-2 font-semibold">Turn on the slider to block a website!</h2>
        <HorizontalCard name="blocked_site.youtube" icon={yt_icon}/>
        <HorizontalCard name="blocked_site.instagram" icon={insta_icon}/>
        <HorizontalCard name="blocked_site.facebook" icon={fb_icon}/>
        <HorizontalCard name="blocked_site.linkedin" icon={linkedin_icon}/>
        <HorizontalCard name="blocked_site.X" icon={x_icon}/>
      </TabsContent>
    </Tabs>
  )
}

