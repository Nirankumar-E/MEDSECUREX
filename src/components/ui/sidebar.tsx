"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { VariantProps, cva } from "class-variance-authority"
import { PanelLeft } from "lucide-react"

import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const SIDEBAR_COOKIE_NAME = "sidebar_state"
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7
const SIDEBAR_WIDTH = "16rem"
const SIDEBAR_WIDTH_MOBILE = "18rem"
const SIDEBAR_WIDTH_ICON = "3.5rem"
const SIDEBAR_KEYBOARD_SHORTCUT = "b"

type SidebarContext = {
  state: "expanded" | "collapsed"
  open: boolean
  setOpen: (open: boolean) => void
  openMobile: boolean
  setOpenMobile: (open: boolean) => void
  isMobile: boolean
  toggleSidebar: () => void
}

const SidebarContext = React.createContext<SidebarContext | null>(null)

function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.")
  }

  return context
}

const SidebarProvider = React.memo(
  React.forwardRef<
    HTMLDivElement,
    React.ComponentProps<"div"> & {
      defaultOpen?: boolean
      open?: boolean
      onOpenChange?: (open: boolean) => void
    }
  >(
    (
      {
        defaultOpen = true,
        open: openProp,
        onOpenChange: setOpenProp,
        className,
        style,
        children,
        ...props
      },
      ref
    ) => {
      const isMobile = useIsMobile()
      const [openMobile, setOpenMobile] = React.useState(false)

      const [_open, _setOpen] = React.useState(defaultOpen)
      const open = openProp ?? _open

      const setOpen = React.useCallback(
        (value: boolean) => {
          if (setOpenProp) {
            setOpenProp(value)
          } else {
            _setOpen(value)
          }
          document.cookie = `${SIDEBAR_COOKIE_NAME}=${value}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`
        },
        [setOpenProp]
      )

      const toggleSidebar = React.useCallback(() => {
        if (isMobile) {
          setOpenMobile((prev) => !prev)
        } else {
          setOpen(!open)
        }
      }, [isMobile, setOpen, open, setOpenMobile])

      React.useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
          if (
            event.key === SIDEBAR_KEYBOARD_SHORTCUT &&
            (event.metaKey || event.ctrlKey)
          ) {
            event.preventDefault()
            toggleSidebar()
          }
        }
        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
      }, [toggleSidebar])

      const state = open ? "expanded" : "collapsed"

      const contextValue = React.useMemo<SidebarContext>(
        () => ({
          state,
          open,
          setOpen,
          isMobile,
          openMobile,
          setOpenMobile,
          toggleSidebar,
        }),
        [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar]
      )

      return (
        <SidebarContext.Provider value={contextValue}>
          <TooltipProvider delayDuration={0}>
            <div
              style={
                {
                  "--sidebar-width": SIDEBAR_WIDTH,
                  "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
                  ...style,
                } as React.CSSProperties
              }
              className={cn(
                "group/sidebar-wrapper flex min-h-svh w-full has-[[data-variant=inset]]:bg-sidebar",
                className
              )}
              ref={ref}
              {...props}
            >
              {children}
            </div>
          </TooltipProvider>
        </SidebarContext.Provider>
      )
    }
  )
)
SidebarProvider.displayName = "SidebarProvider"

const Sidebar = React.memo(
  React.forwardRef<
    HTMLDivElement,
    React.ComponentProps<"div"> & {
      side?: "left" | "right"
      variant?: "sidebar" | "floating" | "inset"
      collapsible?: "icon" | "offcanvas" | "none"
    }
  >(
    (
      {
        side = "left",
        variant = "sidebar",
        collapsible = "icon",
        className,
        children,
        ...props
      },
      ref
    ) => {
      const { isMobile, state, openMobile, setOpenMobile } = useSidebar()

      if (collapsible === "none") {
        return (
          <div
            className={cn(
              "flex h-full w-[--sidebar-width] flex-col bg-sidebar text-sidebar-foreground",
              className
            )}
            ref={ref}
            {...props}
          >
            {children}
          </div>
        )
      }

      if (collapsible === "offcanvas" || isMobile) {
        return (
          <Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>
            <SheetContent
              data-sidebar="sidebar"
              data-mobile="true"
              className="w-[--sidebar-width] bg-sidebar p-0 text-sidebar-foreground [&>button]:hidden"
              style={
                {
                  "--sidebar-width": SIDEBAR_WIDTH_MOBILE,
                } as React.CSSProperties
              }
              side={side}
            >
              <SheetTitle className="sr-only">Main Menu</SheetTitle>
              <div className="flex h-full w-full flex-col">{children}</div>
            </SheetContent>
          </Sheet>
        )
      }

      return (
        <div
          ref={ref}
          className="group peer hidden md:block"
          data-state={state}
          data-collapsible={state === "collapsed" ? collapsible : ""}
          data-variant={variant}
          data-side={side}
        >
          {/* ✅ FIX: Removed spacer div that caused extra gap */}
          <div
            className={cn(
              "duration-200 fixed inset-y-0 z-10 hidden h-svh transition-[left,right,width] ease-linear md:flex",
              variant === "sidebar" && "text-sidebar-foreground",
              side === "left" &&
                "left-0 w-[--sidebar-width] group-data-[collapsible=icon]:group-data-[state=collapsed]:w-[--sidebar-width-icon]",
              side === "right" &&
                "right-0 w-[--sidebar-width] group-data-[collapsible=icon]:group-data-[state=collapsed]:w-[--sidebar-width-icon]",
              className
            )}
            {...props}
          >
            <div
              data-sidebar="sidebar"
              className="flex h-full w-full flex-col border-r bg-sidebar group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:border-sidebar-border group-data-[variant=floating]:shadow"
            >
              {children}
            </div>
          </div>
        </div>
      )
    }
  )
)
Sidebar.displayName = "Sidebar"

const SidebarRail = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex h-full flex-col justify-between p-2 group-data-[collapsible=icon]:group-data-[state=collapsed]:py-2",
          className
        )}
        {...props}
      />
    )
  }
)
SidebarRail.displayName = "SidebarRail"

const SidebarInset = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  const { isMobile } = useSidebar()
  if (isMobile) {
    return <div ref={ref} className={className} {...props} />
  }

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-200 ease-linear md:peer-data-[side=left]:ml-[--sidebar-width-icon] md:peer-data-[state=expanded]:peer-data-[side=left]:ml-[--sidebar-width] md:peer-data-[side=right]:mr-[--sidebar-width-icon] md:peer-data-[state=expanded]:peer-data-[side=right]:mr-[--sidebar-width]",
        "md:peer-data-[collapsible=none]:ml-[--sidebar-width]",
        className
      )}
      {...props}
    />
  )
})
SidebarInset.displayName = "SidebarInset"

const SidebarTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, ...props }, ref) => {
  const { toggleSidebar, isMobile } = useSidebar()

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      className={cn("shrink-0", isMobile ? "" : "", className)}
      onClick={toggleSidebar}
      {...props}
    >
      <PanelLeft />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  )
})
SidebarTrigger.displayName = "SidebarTrigger"

const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex items-center gap-4 border-b p-3", className)}
      {...props}
    />
  )
})
SidebarHeader.displayName = "SidebarHeader"

const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "flex h-full w-full flex-col overflow-y-auto",
        className
      )}
      {...props}
    />
  )
})
SidebarContent.displayName = "SidebarContent"

const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "flex w-full flex-col items-center justify-center gap-2 border-t p-3",
        className
      )}
      {...props}
    />
  )
})
SidebarFooter.displayName = "SidebarFooter"

const SidebarMenu = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "flex w-full flex-col gap-1 p-2 group-data-[collapsible=icon]:group-data-[state=collapsed]:gap-2 group-data-[collapsible=icon]:group-data-[state=collapsed]:p-2",
        className
      )}
      {...props}
    />
  )
})
SidebarMenu.displayName = "SidebarMenu"

const SidebarMenuItem = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn("w-full", className)} {...props} />
})
SidebarMenuItem.displayName = "SidebarMenuItem"

const sidebarButtonVariants = cva(
  "group/sidebar-button flex w-full items-center justify-start gap-2 whitespace-nowrap rounded-md p-2 text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90",
        secondary:
          "bg-sidebar-accent text-sidebar-accent-foreground hover:bg-sidebar-accent/80",
        ghost:
          "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
      },
      isActive: {
        true: "bg-sidebar-accent text-sidebar-accent-foreground",
        false: "",
      },
    },
    defaultVariants: {
      variant: "ghost",
      isActive: false,
    },
  }
)

const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button> &
    VariantProps<typeof sidebarButtonVariants> & {
      asChild?: boolean
      tooltip?: string
    }
>(
  (
    { variant, isActive, asChild = false, className, tooltip, ...props },
    ref
  ) => {
    const { state } = useSidebar()
    const Comp = asChild ? Slot : "button"

    if (state === "collapsed" && tooltip) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <Comp
              ref={ref}
              className={cn(
                sidebarButtonVariants({ variant, isActive }),
                "h-10 justify-center group-data-[collapsible=icon]:group-data-[state=collapsed]:h-10 group-data-[collapsible=icon]:group-data-[state=collapsed]:w-10 group-data-[collapsible=icon]:group-data-[state=collapsed]:p-2",
                className
              )}
              {...props}
            />
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      )
    }

    return (
      <Comp
        ref={ref}
        className={cn(sidebarButtonVariants({ variant, isActive }), className)}
        {...props}
      />
    )
  }
)
SidebarMenuButton.displayName = "SidebarMenuButton"

const SidebarMenuBadge = React.forwardRef<
  HTMLSpanElement,
  React.ComponentProps<"span">
>(({ className, ...props }, ref) => {
  return (
    <span
      ref={ref}
      className={cn(
        "ml-auto text-xs font-semibold text-muted-foreground group-data-[collapsible=icon]:group-data-[state=collapsed]:hidden",
        className
      )}
      {...props}
    />
  )
})
SidebarMenuBadge.displayName = "SidebarMenuBadge"

const SidebarMenuAction = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "ml-auto opacity-0 transition-opacity duration-200 ease-in-out group-hover/sidebar-button:opacity-100 group-data-[collapsible=icon]:group-data-[state=collapsed]:hidden",
        className
      )}
      {...props}
    />
  )
})
SidebarMenuAction.displayName = "SidebarMenuAction"

const SidebarMenuSub = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    open?: boolean
  }
>(({ open: openProp, ...props }, ref) => {
  const [open, setOpen] = React.useState(openProp)
  return (
    <div
      ref={ref}
      data-state={open ? "open" : "closed"}
      onMouseOver={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      {...props}
    />
  )
})
SidebarMenuSub.displayName = "SidebarMenuSub"

const SidebarMenuSubButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button> &
    VariantProps<typeof sidebarButtonVariants> & {
      asChild?: boolean
      isOpen?: boolean
    }
>(({ variant, isActive, asChild, className, children, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      ref={ref}
      className={cn(
        sidebarButtonVariants({ variant, isActive }),
        "group/sidebar-sub-button",
        className
      )}
      {...props}
    >
      {children}
    </Comp>
  )
})
SidebarMenuSubButton.displayName = "SidebarMenuSubButton"

const SidebarMenuSubItem = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "ml-4 hidden h-0 flex-col overflow-hidden transition-all duration-200 ease-in-out data-[state=open]:flex data-[state=open]:h-auto",
        className
      )}
      {...props}
    />
  )
})
SidebarMenuSubItem.displayName = "SidebarMenuSubItem"

const SidebarSeparator = React.forwardRef<
  HTMLHRElement,
  React.ComponentProps<typeof Separator>
>((props, ref) => {
  return (
    <Separator
      ref={ref}
      className="my-1 bg-sidebar-border group-data-[collapsible=icon]:group-data-[state=collapsed]:mx-auto group-data-[collapsible=icon]:group-data-[state=collapsed]:w-3/4"
      {...props}
    />
  )
})
SidebarSeparator.displayName = "SidebarSeparator"

const SidebarInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<typeof Input>
>(({ className, ...props }, ref) => {
  return (
    <div className="relative group-data-[collapsible=icon]:group-data-[state=collapsed]:hidden">
      <Input
        ref={ref}
        className={cn("bg-sidebar-accent pe-8", className)}
        {...props}
      />
    </div>
  )
})
SidebarInput.displayName = "SidebarInput"

const SidebarGroup = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    open?: boolean
  }
>(({ className, open = true, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-state={open ? "open" : "closed"}
      className={cn("space-y-1", className)}
      {...props}
    />
  )
})
SidebarGroup.displayName = "SidebarGroup"

const SidebarGroupLabel = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "truncate px-2 text-xs font-medium uppercase tracking-wider text-muted-foreground group-data-[state=closed]:hidden",
        className
      )}
      {...props}
    />
  )
})
SidebarGroupLabel.displayName = "SidebarGroupLabel"

const SidebarGroupContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "hidden flex-col group-data-[state=open]:flex",
        className
      )}
      {...props}
    />
  )
})
SidebarGroupContent.displayName = "SidebarGroupContent"

const SidebarGroupAction = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>((props, ref) => {
  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      className="ml-auto hidden h-6 w-6 group-data-[state=closed]:hidden group-hover/sidebar-group:flex"
      {...props}
    />
  )
})
SidebarGroupAction.displayName = "SidebarGroupAction"

const SidebarMenuSkeleton = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    count?: number
  }
>(({ className, count = 5, ...props }, ref) => {
  return (
    <div ref={ref} className={cn("flex flex-col gap-2", className)} {...props}>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="h-10 w-full" />
      ))}
    </div>
  )
})
SidebarMenuSkeleton.displayName = "SidebarMenuSkeleton"

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
}
