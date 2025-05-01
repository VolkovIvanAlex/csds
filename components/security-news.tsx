import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { formatDistanceToNow } from "@/lib/utils"

const news = [
  {
    id: "NEWS-001",
    title: "Critical Vulnerability Found in Popular Framework",
    source: "CyberNews",
    category: "Vulnerability",
    date: "2023-06-15T08:30:00",
    logo: "/placeholder.svg?height=32&width=32&query=cybernews",
    initials: "CN",
  },
  {
    id: "NEWS-002",
    title: "New Ransomware Variant Targeting Healthcare Sector",
    source: "Security Weekly",
    category: "Threat",
    date: "2023-06-14T12:45:00",
    logo: "/placeholder.svg?height=32&width=32&query=securityweekly",
    initials: "SW",
  },
  {
    id: "NEWS-003",
    title: "Government Issues Advisory on State-Sponsored Attacks",
    source: "Threat Post",
    category: "Advisory",
    date: "2023-06-13T15:20:00",
    logo: "/placeholder.svg?height=32&width=32&query=threatpost",
    initials: "TP",
  },
  {
    id: "NEWS-004",
    title: "Major Tech Company Releases Security Patches",
    source: "Dark Reading",
    category: "Update",
    date: "2023-06-12T09:10:00",
    logo: "/placeholder.svg?height=32&width=32&query=darkreading",
    initials: "DR",
  },
]

export function SecurityNews() {
  return (
    <div className="space-y-4">
      {news.map((item) => (
        <Card key={item.id} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex items-start gap-4 p-4">
              <Avatar className="h-10 w-10 border">
                <AvatarImage src={item.logo || "/placeholder.svg"} alt={item.source} />
                <AvatarFallback>{item.initials}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold">{item.title}</h4>
                  <Badge
                    variant={
                      item.category === "Vulnerability"
                        ? "destructive"
                        : item.category === "Threat"
                          ? "default"
                          : "secondary"
                    }
                    className="ml-auto"
                  >
                    {item.category}
                  </Badge>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <span>{item.source}</span>
                  <span className="mx-2">•</span>
                  <span>{formatDistanceToNow(new Date(item.date))}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 border-t bg-muted/50 p-2">
              <Button variant="ghost" size="sm">
                Read More
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
