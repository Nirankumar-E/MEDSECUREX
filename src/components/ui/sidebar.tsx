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
const SIDEBAR_WIDTH_ICON = "4.5rem"
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
        defaultOpen = false, // Start collapsed
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
          <div
            className={cn(
              "duration-200 relative h-svh bg-transparent transition-[width] ease-linear",
              "w-[--sidebar-width] group-data-[collapsible=icon]:group-data-[state=collapsed]:w-[--sidebar-width-icon]",
              "group-data-[side=right]:rotate-180"
            )}
          />
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

const SidebarTrigger = React.forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentProps<typeof Button>
>(({ className, onClick, ...props }, ref) => {
  const { toggleSidebar } = useSidebar()

  return (
    <Button
      ref={ref}
      data-sidebar="trigger"
      variant="ghost"
      size="icon"
      className={cn("h-8 w-8", className)}
      onClick={(event) => {
        onClick?.(event)
        toggleSidebar()
      }}
      {...props}
    >
      <PanelLeft />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  )
})
SidebarTrigger.displayName = "SidebarTrigger"

const SidebarRail = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button">
>(({ className, ...props }, ref) => {
  const { toggleSidebar } = useSidebar()

  return (
    <button
      ref={ref}
      data-sidebar="rail"
      aria-label="Toggle Sidebar"
      tabIndex={-1}
      onClick={toggleSidebar}
      title="Toggle Sidebar"
      className={cn(
        "absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] hover:after:bg-sidebar-border group-data-[side=left]:-right-4 group-data-[side=right]:left-0 sm:flex",
        "[[data-side=left]_&]:cursor-w-resize [[data-side=right]_&]:cursor-e-resize",
        "[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize",
        className
      )}
      {...props}
    />
  )
})
SidebarRail.displayName = "SidebarRail"

const SidebarInset = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"main">
>(({ className, ...props }, ref) => {
  return (
    <main
      ref={ref}
      className={cn(
        "relative flex min-h-svh flex-1 flex-col bg-background transition-[margin-left,margin-right] duration-200 ease-linear",
        "md:peer-data-[collapsible=icon]:peer-data-[state=expanded]:peer-data-[side=left]:ml-[--sidebar-width]",
        "md:peer-data-[collapsible=icon]:peer-data-[state=collapsed]:peer-data-[side=left]:ml-[--sidebar-width-icon]",
        "md:peer-data-[collapsible=icon]:peer-data-[state=expanded]:peer-data-[side=right]:mr-[--sidebar-width]",
        "md:peer-data-[collapsible=icon]:peer-data-[state=collapsed]:peer-data-[side=right]:mr-[--sidebar-width-icon]",
        "md:peer-data-[collapsible=none]:peer-data-[side=left]:ml-[--sidebar-width]",
        className
      )}
      {...props}
    />
  )
})
SidebarInset.displayName = "SidebarInset"

const SidebarInput = React.forwardRef<
  React.ElementRef<typeof Input>,
  React.ComponentProps<typeof Input>
>(({ className, ...props }, ref) => {
  return (
    <Input
      ref={ref}
      data-sidebar="input"
      className={cn(
        "h-8 w-full bg-background shadow-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
        className
      )}
      {...props}
    />
  )
})
SidebarInput.displayName = "SidebarInput"

const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="header"
      className={cn("flex h-14 shrink-0 items-center gap-2 border-b p-4", className)}
      {...props}
    />
  )
})
SidebarHeader.displayName = "SidebarHeader"

const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="footer"
      className={cn("flex flex-col gap-2 p-2 mt-auto border-t", className)}
      {...props}
    />
  )
})
SidebarFooter.displayName = "SidebarFooter"

const SidebarSeparator = React.forwardRef<
  React.ElementRef<typeof Separator>,
  React.ComponentProps<typeof Separator>
>(({ className, ...props }, ref) => {
  return (
    <Separator
      ref={ref}
      data-sidebar="separator"
      className={cn("mx-2 w-auto bg-sidebar-border", className)}
      {...props}
    />
  )
})
SidebarSeparator.displayName = "SidebarSeparator"

const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="content"
      className={cn(
        "flex min-h-0 flex-1 flex-col",
        className
      )}
      {...props}
    />
  )
})
SidebarContent.displayName = "SidebarContent"

const SidebarGroup = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="group"
      className={cn("relative flex w-full min-w-0 flex-col p-2", className)}
      {...props}
    />
  )
})
SidebarGroup.displayName = "SidebarGroup"

const SidebarGroupLabel = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & { asChild?: boolean }
>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "div"

  return (
    <Comp
      ref={ref}
      data-sidebar="group-label"
      className={cn(
        "duration-200 flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-sidebar-foreground/70 outline-none ring-sidebar-ring transition-[margin,opa] ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        "group-data-[collapsible=icon]:group-data-[state=collapsed]:-mt-8 group-data-[collapsible=icon]:group-data-[state=collapsed]:opacity-0",
        className
      )}
      {...props}
    />
  )
})
SidebarGroupLabel.displayName = "SidebarGroupLabel"

const SidebarGroupAction = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & { asChild?: boolean }
>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      ref={ref}
      data-sidebar="group-action"
      className={cn(
        "absolute right-3 top-3.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground outline-none ring-sidebar-ring transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        "after:absolute after:-inset-2 after:md:hidden",
        "group-data-[collapsible=icon]:group-data-[state=collapsed]:hidden",
        className
      )}
      {...props}
    />
  )
})
SidebarGroupAction.displayName = "SidebarGroupAction"

const SidebarGroupContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-sidebar="group-content"
    className={cn("w-full text-sm", className)}
    {...props}
  />
))
SidebarGroupContent.displayName = "SidebarGroupContent"

const SidebarMenu = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    data-sidebar="menu"
    className={cn("flex w-full min-w-0 flex-col gap-0.5 p-2", className)}
    {...props}
  />
))
SidebarMenu.displayName = "SidebarMenu"

const SidebarMenuItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
  <li
    ref={ref}
    data-sidebar="menu-item"
    className={cn("group/menu-item relative", className)}
    {...props}
  />
))
SidebarMenuItem.displayName = "SidebarMenuItem"

const sidebarMenuButtonVariants = cva(
    "peer/menu-button flex w-full items-center justify-start gap-3 overflow-hidden rounded-md px-4 py-2 text-left text-sm outline-none ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-primary-foreground",
    {
        variants: {
            variant: {
                default: "text-sidebar-foreground",
                primary: "bg-sidebar-primary text-sidebar-primary-foreground",
                secondary: "text-sidebar-foreground/70",
                ghost: "text-sidebar-foreground",
            },
            size: {
                default: "h-9",
                sm: "h-8",
                lg: "h-10",
                icon: "size-9 p-2",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

const SidebarMenuButton = React.memo(
  React.forwardRef<
    HTMLButtonElement,
    React.ComponentProps<"button"> &
      VariantProps<typeof sidebarMenuButtonVariants> & {
        asChild?: boolean
        isActive?: boolean
        tooltip?: React.ReactNode
      }
  >(
    (
      {
        asChild = false,
        variant = "default",
        size = "default",
        isActive,
        className,
        tooltip,
        children,
        ...props
      },
      ref
    ) => {
      const Comp = asChild ? Slot : "button"
      const { state } = useSidebar()
      const isCollapsed = state === "collapsed"

      const button = (
        <Comp
          ref={ref}
          data-sidebar="menu-button"
          data-active={isActive}
          data-collapsed={isCollapsed}
          className={cn(
            sidebarMenuButtonVariants({ variant, size, className }),
            isCollapsed && "h-auto w-auto p-2"
          )}
          {...props}
        >
          {isCollapsed ? (
            children
          ) : (
            <>
              {children}
              <span className="duration-200 w-full min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap transition-opacity ease-linear group-data-[collapsible=icon]:group-data-[state=collapsed]:sr-only group-data-[collapsible=icon]:group-data-[state=collapsed]:opacity-0" />
            </>
          )}
        </Comp>
      )

      if (tooltip && state === "collapsed") {
        return (
          <Tooltip>
            <TooltipTrigger asChild>{button}</TooltipTrigger>
            <TooltipContent side="right" sideOffset={8}>
              {tooltip}
            </TooltipContent>
          </Tooltip>
        )
      }

      return button
    }
  )
)
SidebarMenuButton.displayName = "SidebarMenuButton"

const SidebarMenuAction = React.forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentProps<typeof Button>
>(({ className, ...props }, ref) => (
  <Button
    ref={ref}
    data-sidebar="menu-action"
    variant="ghost"
    size="icon"
    className={cn(
      "absolute right-2 top-1/2 z-10 size-6 -translate-y-1/2 rounded-md p-1 transition-opacity group-data-[collapsible=icon]:group-data-[state=collapsed]:hidden peer-data-[active=true]/menu-button:bg-sidebar-primary peer-data-[active=true]/menu-button:text-sidebar-primary-foreground peer-hover/menu-button:bg-sidebar-accent peer-hover/menu-button:text-sidebar-accent-foreground md:opacity-0 md:group-hover/menu-item:opacity-100",
      className
    )}
    {...props}
  />
))
SidebarMenuAction.displayName = "SidebarMenuAction"

const SidebarUser = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    user: { name: string; email: string; avatar: string }
  }
>(({ user, className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="user"
      className={cn(
        "duration-200 flex w-full items-center gap-3 overflow-hidden rounded-md px-4 py-2 text-left text-sm transition-[width,height,padding] ease-linear hover:bg-sidebar-accent",
        "group-data-[collapsible=icon]:group-data-[state=collapsed]:w-auto group-data-[collapsible=icon]:group-data-[state=collapsed]:p-2",
        className
      )}
      {...props}
    >
      <div className="relative size-7 shrink-0">
        <Skeleton className="absolute inset-0 size-full rounded-full" />
        <img
          src={user.avatar}
          alt={user.name}
          className="absolute inset-0 size-full rounded-full"
        />
      </div>
      <div className="duration-200 w-full min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap transition-opacity ease-linear group-data-[collapsible=icon]:group-data-[state=collapsed]:sr-only group-data-[collapsible=icon]:group-data-[state=collapsed]:opacity-0">
        <div className="text-sm font-medium">{user.name}</div>
        <div className="text-xs text-sidebar-foreground/70">{user.email}</div>
      </div>
    </div>
  )
})
SidebarUser.displayName = "SidebarUser"

export {
  SidebarProvider,
  Sidebar,
  SidebarTrigger,
  SidebarRail,
  SidebarInset,
  SidebarHeader,
  SidebarFooter,
  SidebarContent,
  SidebarSeparator,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuAction,
  SidebarInput,
  SidebarUser,
  useSidebar,
}
export type { SidebarContext }
