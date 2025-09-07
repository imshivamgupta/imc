<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
    <!-- Hero Section -->
    <section
      class="relative overflow-hidden bg-gradient-to-br from-purple-100 via-violet-50 to-indigo-100 min-h-[80vh]"
    >
      <!-- Curved Background Elements -->
      <div class="absolute inset-0">
        <!-- Main curved shape -->
        <div class="absolute top-0 right-0 w-2/3 h-full curved-bg">
          <svg
            viewBox="0 0 100 100"
            class="w-full h-full"
            preserveAspectRatio="none"
          >
            <path
              d="M30,0 C60,20 80,40 100,0 L100,100 L0,100 Z"
              fill="url(#gradient1)"
              opacity="0.8"
            />
            <defs>
              <linearGradient
                id="gradient1"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop
                  offset="0%"
                  style="stop-color: #8b5cf6; stop-opacity: 0.3"
                />
                <stop
                  offset="100%"
                  style="stop-color: #6366f1; stop-opacity: 0.5"
                />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <!-- Secondary curved element -->
        <div class="absolute top-1/4 right-1/4 w-1/2 h-1/2 curved-bg">
          <svg
            viewBox="0 0 100 100"
            class="w-full h-full"
            preserveAspectRatio="none"
          >
            <path
              d="M20,0 C50,30 70,60 100,40 L100,100 L0,100 Z"
              fill="url(#gradient2)"
              opacity="0.4"
            />
            <defs>
              <linearGradient
                id="gradient2"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop
                  offset="0%"
                  style="stop-color: #a855f7; stop-opacity: 0.2"
                />
                <stop
                  offset="100%"
                  style="stop-color: #3b82f6; stop-opacity: 0.3"
                />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <!-- Floating text elements -->
        <div
          class="absolute top-16 right-20 transform rotate-12 text-violet-400/30 font-medium text-sm hidden lg:block floating-element"
        >
          discover • explore • connect
        </div>
        <div
          class="absolute bottom-32 right-32 transform -rotate-12 text-purple-400/30 font-medium text-sm hidden lg:block floating-element"
        >
          local businesses • social presence
        </div>
      </div>

      <div
        class="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-8"
      >
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <!-- Content Side -->
          <div class="space-y-8">
            <!-- Badge -->
            <Badge
              variant="secondary"
              class="w-fit bg-violet-100 text-violet-700 border-violet-200"
            >
              City Explorer & Business Solutions
            </Badge>

            <!-- Main Heading -->
            <div class="space-y-4">
              <h1
                class="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl"
              >
                Explore your city like
                <span class="gradient-text text-transparent">
                  never before.
                </span>
              </h1>

              <p class="text-lg leading-relaxed text-gray-600 max-w-lg">
                Discover amazing businesses, shops, restaurants, and malls in
                your city. We also offer customized web presence pages to help
                local businesses build their social presence and connect with
                customers.
              </p>
            </div>

            <!-- Action Buttons -->
            <div class="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                class="bg-violet-600 hover:bg-violet-700 text-white px-8 py-3"
                as-child
              >
                <NuxtLink to="/auth/register"> Get Started </NuxtLink>
              </Button>
              <Button
                variant="outline"
                size="lg"
                class="border-violet-200 text-violet-700 hover:bg-violet-50 px-8 py-3"
                as-child
              >
                <NuxtLink to="/users"> Explore Businesses </NuxtLink>
              </Button>
            </div>

            <!-- Stats or Features Preview -->
            <div class="grid grid-cols-3 gap-6 pt-8">
              <div class="text-center">
                <div class="text-2xl font-bold text-violet-600">500+</div>
                <div class="text-sm text-gray-600">Local Businesses</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-purple-600">50+</div>
                <div class="text-sm text-gray-600">Cities Covered</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-indigo-600">24/7</div>
                <div class="text-sm text-gray-600">Support</div>
              </div>
            </div>
          </div>

          <!-- Image/Visual Side -->
          <div class="relative lg:h-[600px] flex items-center justify-center">
            <!-- Main circular background -->
            <div class="absolute inset-0 flex items-center justify-center">
              <div
                class="w-80 h-80 lg:w-96 lg:h-96 rounded-full bg-gradient-to-br from-violet-200 via-purple-200 to-indigo-200 opacity-50"
              ></div>
            </div>

            <!-- Secondary circle -->
            <div class="absolute inset-0 flex items-center justify-center">
              <div
                class="w-64 h-64 lg:w-80 lg:h-80 rounded-full bg-gradient-to-br from-white to-violet-100 opacity-80"
              ></div>
            </div>

            <!-- Placeholder for person/yoga image -->
            <div
              class="relative z-10 w-48 h-48 lg:w-64 lg:h-64 rounded-full bg-gradient-to-br from-violet-300 to-purple-400 flex items-center justify-center shadow-2xl hero-image"
            >
              <Building2 class="w-16 h-16 text-white" />
            </div>

            <!-- Floating elements with proper Lucide icons -->
            <div
              class="absolute top-1/4 left-1/4 w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center floating-element"
            >
              <Store class="w-8 h-8 text-blue-600" />
            </div>
            <div
              class="absolute bottom-1/3 right-1/4 w-12 h-12 bg-violet-100 rounded-full shadow-lg flex items-center justify-center floating-element"
            >
              <ShoppingBag class="w-6 h-6 text-violet-600" />
            </div>
            <div
              class="absolute top-1/3 right-1/3 w-8 h-8 bg-purple-200 rounded-full shadow-md floating-element flex items-center justify-center z-10"
            >
              <UtensilsCrossed class="w-4 h-4 text-purple-600" />
            </div>
            <div
              class="absolute bottom-1/4 left-1/3 w-8 h-8 bg-purple-200 rounded-full shadow-md floating-element flex items-center justify-center"
            >
              <MapPin class="w-4 h-4 text-indigo-600" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Quick Navigation -->
    <section class="py-16">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h2
            class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
          >
            Explore & Connect
          </h2>
          <p class="mt-4 text-lg text-gray-600">
            Discover local businesses and build your digital presence
          </p>
        </div>

        <div class="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card
            class="group cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1"
            as-child
          >
            <NuxtLink to="/users">
              <CardHeader class="text-center">
                <div
                  class="mx-auto h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors"
                >
                  <Store class="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle class="text-lg">Local Businesses</CardTitle>
              </CardHeader>
              <CardContent>
                <p class="text-sm text-gray-600 text-center">
                  Discover amazing shops, restaurants, and services in your area
                </p>
              </CardContent>
            </NuxtLink>
          </Card>

          <Card
            class="group cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1"
            as-child
          >
            <NuxtLink to="/users-ssr" @click="navigateToSSR">
              <CardHeader class="text-center">
                <div
                  class="mx-auto h-12 w-12 rounded-lg bg-orange-100 flex items-center justify-center group-hover:bg-orange-200 transition-colors"
                >
                  <Building2 class="w-6 h-6 text-orange-600" />
                </div>
                <CardTitle class="text-lg">Shopping Centers</CardTitle>
              </CardHeader>
              <CardContent>
                <p class="text-sm text-gray-600 text-center">
                  Explore malls, boutiques, and shopping destinations
                </p>
                <Badge variant="secondary" class="mt-2 mx-auto block w-fit"
                  >Popular</Badge
                >
              </CardContent>
            </NuxtLink>
          </Card>

          <Card
            class="group cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1"
            as-child
          >
            <NuxtLink to="/posts">
              <CardHeader class="text-center">
                <div
                  class="mx-auto h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition-colors"
                >
                  <UtensilsCrossed class="w-6 h-6 text-green-600" />
                </div>
                <CardTitle class="text-lg">Restaurants</CardTitle>
              </CardHeader>
              <CardContent>
                <p class="text-sm text-gray-600 text-center">
                  Find the best dining experiences and local cuisine
                </p>
              </CardContent>
            </NuxtLink>
          </Card>

          <Card
            class="group cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1"
            as-child
          >
            <NuxtLink to="/auth/register">
              <CardHeader class="text-center">
                <div
                  class="mx-auto h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center group-hover:bg-purple-200 transition-colors"
                >
                  <Briefcase class="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle class="text-lg">Business Solutions</CardTitle>
              </CardHeader>
              <CardContent>
                <p class="text-sm text-gray-600 text-center">
                  Get your business online with custom web presence pages
                </p>
                <Badge variant="outline" class="mt-2 mx-auto block w-fit"
                  >For Business</Badge
                >
              </CardContent>
            </NuxtLink>
          </Card>
        </div>
      </div>
    </section>

    <!-- App Features -->
    <section class="py-16 bg-white">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h2
            class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
          >
            Why Choose Our Platform
          </h2>
          <p class="mt-4 text-lg text-gray-600">
            Everything you need to explore your city and grow your business
          </p>
        </div>

        <div class="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <Card class="text-center">
            <CardHeader>
              <div
                class="mx-auto h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center mb-4"
              >
                <MapPin class="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle class="text-xl">City Explorer</CardTitle>
            </CardHeader>
            <CardContent>
              <p class="text-gray-600">
                Discover hidden gems, popular spots, and local favorites in your
                city with our comprehensive directory.
              </p>
              <Badge variant="default" class="mt-3">Discovery</Badge>
            </CardContent>
          </Card>

          <Card class="text-center">
            <CardHeader>
              <div
                class="mx-auto h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-4"
              >
                <Globe class="w-8 h-8 text-green-600" />
              </div>
              <CardTitle class="text-xl">Social Presence</CardTitle>
            </CardHeader>
            <CardContent>
              <p class="text-gray-600">
                We create customized web presence pages for businesses to build
                their social presence and connect with customers.
              </p>
              <Badge variant="default" class="mt-3">Web Presence</Badge>
            </CardContent>
          </Card>

          <Card class="text-center">
            <CardHeader>
              <div
                class="mx-auto h-16 w-16 rounded-full bg-purple-100 flex items-center justify-center mb-4"
              >
                <Users class="w-8 h-8 text-purple-600" />
              </div>
              <CardTitle class="text-xl">Business Connect</CardTitle>
            </CardHeader>
            <CardContent>
              <p class="text-gray-600">
                Connect local businesses with their community through our
                platform, fostering local economic growth.
              </p>
              <Badge variant="default" class="mt-3">Community</Badge>
            </CardContent>
          </Card>

          <Card class="text-center">
            <CardHeader>
              <div
                class="mx-auto h-16 w-16 rounded-full bg-orange-100 flex items-center justify-center mb-4"
              >
                <Zap class="w-8 h-8 text-orange-600" />
              </div>
              <CardTitle class="text-xl">Modern Platform</CardTitle>
            </CardHeader>
            <CardContent>
              <p class="text-gray-600">
                Built with cutting-edge technology to provide fast, reliable,
                and user-friendly experiences across all devices.
              </p>
              <Badge variant="default" class="mt-3">Technology</Badge>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import {
  Store,
  ShoppingBag,
  Building2,
  MapPin,
  UtensilsCrossed,
  Briefcase,
  Globe,
  Users,
  Zap,
} from "lucide-vue-next";

// Set page metadata
useHead({
  title: "City Explorer - Discover Local Businesses",
});

// Auth composable
const { user, isAuthenticated } = useAuth();

// Global loader
const globalLoader = useGlobalLoader();

// Navigation functions
const navigateToSSR = () => {
  globalLoader.showLoader("Loading SSR Users Page...");
  // NuxtLink will handle the actual navigation
};

onMounted(() => {
  // Hide loader when page is fully mounted and hydrated
  nextTick(() => {
    globalLoader.hideLoader();
  });
});
</script>

<style scoped>
/* Custom styles for enhanced animations and effects */
.group:hover .group-hover\:bg-blue-200 {
  transition: background-color 0.2s ease;
}

.group:hover .group-hover\:bg-orange-200 {
  transition: background-color 0.2s ease;
}

.group:hover .group-hover\:bg-green-200 {
  transition: background-color 0.2s ease;
}

.group:hover .group-hover\:bg-purple-200 {
  transition: background-color 0.2s ease;
}

/* Hero section animations */
@keyframes float {
  0%,
  100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-10px) rotate(2deg);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

/* Apply animations */
.hero-image {
  animation: float 6s ease-in-out infinite;
}

.floating-element {
  animation: float 4s ease-in-out infinite;
}

.floating-element:nth-child(2) {
  animation-delay: 1s;
}

.floating-element:nth-child(3) {
  animation-delay: 2s;
}

.floating-element:nth-child(4) {
  animation-delay: 3s;
}

/* Gradient text animation */
.gradient-text {
  background: linear-gradient(-45deg, #8b5cf6, #6366f1, #a855f7, #3b82f6);
  background-size: 400% 400%;
  background-clip: text;
  -webkit-background-clip: text;
  animation: gradientShift 4s ease infinite;
}

@keyframes gradientShift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* Curved path animations */
.curved-bg {
  animation: pulse 8s ease-in-out infinite;
}
</style>
