import { Switch } from "@/components/ui/switch"
import { useState, useEffect } from "react";

export default function HorizontalCard(props: { name: string; icon: string | undefined;}) {
  const [isChecked, setChecked] = useState(false)

  useEffect(() => {
    const fetchBlocked = async () => {
        const isBlocked = await chrome.storage.local.get(props.name)
        if (isBlocked[props.name]) {
            setChecked(true) 
        }
    }

    fetchBlocked()
  },[])

  const onclick = () => {
    if (!isChecked) {
        chrome.storage.local.set({ [props.name]: true })
        setChecked(true)
    } else {
        chrome.storage.local.set({ [props.name]: false })
        setChecked(false)
    }
  }

  return (
    <div className="flex items-center justify-between px-6 py-4">
        <img src={props.icon} alt="logo" width={45} height={45}/>
        <Switch checked={isChecked} onClick={onclick} />
    </div>
  )
}

