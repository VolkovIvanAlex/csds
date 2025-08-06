"use client"

import { useEffect, useState, useMemo } from "react"
import { useParams, useRouter } from "next/navigation"
import { useReport } from "@/hooks/report.hooks"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Spinner } from "@/components/ui/spinner"
import { ArrowLeft, Search, Calendar as CalendarIcon, X } from "lucide-react"
import { DateRange } from "react-day-picker"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar" // Use the styled Calendar component
import { format } from "date-fns"
import { cn } from "@/lib/utils"

// Define a type for the action object for clarity
type ResponseAction = {
  id: string;
  description: string;
  createdAt: string;
  proposedBy: { name: string };
};

export default function ReportActionsPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const { getResponseActions } = useReport()

  const reportId = Array.isArray(params.id) ? params.id[0] : params.id

  const [actions, setActions] = useState<ResponseAction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [selectedAction, setSelectedAction] = useState<ResponseAction | null>(null)

  useEffect(() => {
    if (reportId) {
      setIsLoading(true)
      getResponseActions({
        reportId,
        options: {
          onSuccess: (data) => {
            setActions(data)
            setIsLoading(false)
          },
          onError: (error) => {
            toast({ title: "Error", description: error, variant: "destructive" })
            setIsLoading(false)
          },
        },
      })
    }
  }, [reportId, getResponseActions, toast])

  const filteredActions = useMemo(() => {
    return actions.filter((action) => {
      const actionDate = new Date(action.createdAt);
      
      const matchesSearch = action.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            action.proposedBy.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesDate = !dateRange || (
        (!dateRange.from || actionDate >= dateRange.from) &&
        // Adjust to include the full 'to' day
        (!dateRange.to || actionDate <= new Date(dateRange.to.setHours(23, 59, 59, 999)))
      );

      return matchesSearch && matchesDate
    })
  }, [actions, searchQuery, dateRange])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", { dateStyle: "long", timeStyle: "short" }).format(date)
  }

  // Handler to reset filters
  const handleResetFilters = () => {
    setSearchQuery("");
    setDateRange(undefined);
  };

  return (
    <div className="container mx-auto max-w-4xl w-full space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">All Response Actions</h1>
          <p className="text-muted-foreground">Viewing all actions for report ID: {reportId}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search actions by description or author..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn("w-full sm:w-[280px] justify-start text-left font-normal", !dateRange && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="range"
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
            {/* ADDED: Reset Filters Button */}
            {(searchQuery || dateRange) && (
              <Button variant="ghost" size="icon" onClick={handleResetFilters}>
                <X className="h-4 w-4" />
                <span className="sr-only">Reset filters</span>
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-10"><Spinner /></div>
          ) : filteredActions.length > 0 ? (
            <div className="space-y-4">
              {filteredActions.map((action) => (
                <Card key={action.id} className="cursor-pointer hover:bg-muted/50" onClick={() => setSelectedAction(action)}>
                  <CardContent className="p-4">
                    <p className="text-sm line-clamp-2">{action.description}</p>
                    <p className="text-xs text-muted-foreground mt-2 text-right">
                      — {action.proposedBy.name} on {formatDate(action.createdAt)}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-10">No response actions found matching your criteria.</p>
          )}
        </CardContent>
      </Card>

      {/* Action Details Dialog */}
      {selectedAction && (
        <Dialog open={!!selectedAction} onOpenChange={(isOpen) => !isOpen && setSelectedAction(null)}>
          <DialogContent className="sm:max-w-[900px]">
            <DialogHeader>
              <DialogTitle>Action Details</DialogTitle>
              <DialogDescription>
                Suggested by {selectedAction.proposedBy.name} ({selectedAction.proposedBy.email}) on {formatDate(selectedAction.createdAt)}
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 whitespace-pre-wrap text-sm max-h-[60vh] overflow-y-auto">
              {selectedAction.description}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
