<template>
  <nav
    class="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
  >
    <div class="container mx-auto flex h-16 items-center justify-between px-4">
      <!-- Logo -->
      <NuxtLink to="/" class="flex items-center space-x-2">
        <div
          class="flex h-8 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground"
        >
          <span class="text-sm font-bold">IMC</span>
        </div>
        <span class="hidden font-bold sm:inline-block">InMyCity</span>
      </NuxtLink>

      <!-- Desktop Navigation -->
      <NavigationMenu class="hidden md:flex">
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink as-child>
              <NuxtLink
                to="/"
                class="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
              >
                Home
              </NuxtLink>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink as-child>
              <NuxtLink
                to="/posts"
                class="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
              >
                Posts
              </NuxtLink>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink as-child>
              <NuxtLink
                to="/users"
                class="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
              >
                Users
              </NuxtLink>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink as-child>
              <NuxtLink
                to="/pages-test"
                class="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
              >
                Pages
              </NuxtLink>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      <!-- User Menu / Auth Buttons -->
      <div class="flex items-center space-x-4">
        <div
          v-if="isAuthenticated"
          class="hidden md:flex items-center space-x-2"
        >
          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <Button variant="ghost" class="relative h-10 w-10 rounded-full">
                <Avatar class="h-10 w-10">
                  <AvatarImage
                    v-if="user?.image_path"
                    :src="user.image_path"
                    :alt="user?.name"
                  />
                  <AvatarFallback class="bg-primary text-primary-foreground">
                    {{ getUserInitials() }}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent class="w-56" align="end" :side-offset="5">
              <DropdownMenuLabel class="font-normal">
                <div class="flex flex-col space-y-1">
                  <p class="text-sm font-medium leading-none">
                    {{ user?.name }}
                  </p>
                  <p class="text-xs leading-none text-muted-foreground">
                    {{ user?.email }}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem as-child>
                <NuxtLink to="/profile" class="w-full cursor-pointer">
                  <User class="mr-2 h-4 w-4" />
                  Profile
                </NuxtLink>
              </DropdownMenuItem>
              <DropdownMenuItem as-child>
                <NuxtLink to="/create-page" class="w-full cursor-pointer">
                  <Plus class="mr-2 h-4 w-4" />
                  Create Page
                </NuxtLink>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                @click="handleLogout"
                class="text-red-600 cursor-pointer"
              >
                <LogOut class="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div v-else class="hidden md:flex items-center space-x-2">
          <Button variant="ghost" as-child>
            <NuxtLink to="/auth/login"> Log in </NuxtLink>
          </Button>
          <Button as-child>
            <NuxtLink to="/auth/register"> Sign up </NuxtLink>
          </Button>
        </div>

        <!-- Mobile Menu Button -->
        <Sheet>
          <SheetTrigger as-child>
            <Button variant="ghost" class="md:hidden h-10 w-10 p-0">
              <Menu class="h-5 w-5" />
              <span class="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" class="w-[300px] sm:w-[400px]">
            <SheetHeader>
              <SheetTitle class="text-left">
                <div class="flex items-center space-x-2">
                  <div
                    class="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground"
                  >
                    <span class="text-sm font-bold">YA</span>
                  </div>
                  <span class="font-bold">Your App</span>
                </div>
              </SheetTitle>
            </SheetHeader>

            <div class="grid gap-4 py-6">
              <!-- User Info (Mobile) -->
              <div
                v-if="isAuthenticated"
                class="flex items-center space-x-3 p-4 border rounded-lg"
              >
                <Avatar class="h-12 w-12">
                  <AvatarImage
                    v-if="user?.image_path"
                    :src="user.image_path"
                    :alt="user?.name"
                  />
                  <AvatarFallback class="bg-primary text-primary-foreground">
                    {{ getUserInitials() }}
                  </AvatarFallback>
                </Avatar>
                <div class="flex flex-col">
                  <p class="text-sm font-medium">{{ user?.name }}</p>
                  <p class="text-xs text-muted-foreground">{{ user?.email }}</p>
                </div>
              </div>

              <!-- Navigation Links -->
              <nav class="grid gap-2">
                <NuxtLink
                  to="/"
                  class="flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
                >
                  <Home class="h-4 w-4" />
                  <span>Home</span>
                </NuxtLink>
                <NuxtLink
                  to="/posts"
                  class="flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
                >
                  <FileText class="h-4 w-4" />
                  <span>Posts</span>
                </NuxtLink>
                <NuxtLink
                  to="/users"
                  class="flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
                >
                  <Users class="h-4 w-4" />
                  <span>Users</span>
                </NuxtLink>
                <NuxtLink
                  to="/pages-test"
                  class="flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
                >
                  <FileText class="h-4 w-4" />
                  <span>Pages</span>
                </NuxtLink>
                <NuxtLink
                  to="/create-page"
                  class="flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
                >
                  <Plus class="h-4 w-4" />
                  <span>Create Page</span>
                </NuxtLink>

                <Separator v-if="isAuthenticated" class="my-2" />

                <NuxtLink
                  v-if="isAuthenticated"
                  to="/profile"
                  class="flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
                >
                  <User class="h-4 w-4" />
                  <span>Profile</span>
                </NuxtLink>
                <button
                  v-if="isAuthenticated"
                  @click="handleLogout"
                  class="flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground text-red-600"
                >
                  <LogOut class="h-4 w-4" />
                  <span>Log out</span>
                </button>
              </nav>

              <!-- Auth Buttons (Mobile) -->
              <div v-if="!isAuthenticated" class="grid gap-2 pt-4">
                <Button variant="outline" as-child class="w-full">
                  <NuxtLink to="/auth/login"> Log in </NuxtLink>
                </Button>
                <Button as-child class="w-full">
                  <NuxtLink to="/auth/register"> Sign up </NuxtLink>
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { Button } from "~/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "~/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { Separator } from "~/components/ui/separator";
import {
  Menu,
  User,
  LogOut,
  Home,
  FileText,
  Users,
  Plus,
} from "lucide-vue-next";

const { user, isAuthenticated, logout } = useAuth();

// Helper functions
const getUserInitials = () => {
  if (!user.value?.name) return "?";
  return user.value.name
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const handleLogout = async () => {
  await logout();
};
</script>

<style scoped>
/* Custom styles for router-link-active state */
.router-link-active {
  background-color: hsl(var(--accent));
  color: hsl(var(--accent-foreground));
}

/* Ensure smooth transitions for mobile sheet */
.transition-transform {
  transition: transform 0.3s ease-in-out;
}
</style>
