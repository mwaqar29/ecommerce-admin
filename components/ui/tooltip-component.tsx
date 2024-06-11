import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface TooltipProps {
  trigger: React.ReactNode
  content: React.ReactNode
}

const TooltipComponent: React.FC<TooltipProps> = ({ trigger, content }) => {
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>{trigger}</TooltipTrigger>
        <TooltipContent side="left">{content}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default TooltipComponent
