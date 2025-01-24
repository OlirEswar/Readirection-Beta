import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function HorizontalCardWithButtons(props: { link: string | undefined ; title: string | undefined; action: (name: string) => Promise<void>;}) {
  const handleclick = (link: string) => {
    chrome.tabs.create({
      url: link
    })
  }
  
  return (
    <Card className="w-full max-w-3xl my-2">
      <CardContent className="flex px-2 py-6 items-center justify-between">
        <a href={props.link} onClick={() => handleclick(props.link!)} className="text-left mr-2 max-h-18 text-ellipsis overflow-hidden">{props.title}</a>
        <div className="space-x-4">
          <Button onClick={() => props.action(props.link!)}>X</Button>
        </div>
      </CardContent>
    </Card>
  )
}