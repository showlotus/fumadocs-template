import Link from 'next/link'
import { cn } from '@/lib/cn'
import { buttonVariants } from 'fumadocs-ui/components/ui/button'
import { Button } from '@/components/button'

export default function HomePage() {
  return (
    <div className="flex flex-col justify-start text-center flex-1">
      <div className="mt-8 mx-auto relative flex min-h-[300px] h-[30vh] max-h-[900px] border rounded-2xl overflow-hidden w-full max-w-[1400px] bg-origin-border">
        {/* <Hero /> */}
        <div className="flex flex-col z-2 px-4 size-full md:p-12 max-md:items-center max-md:text-center">
          <h1 className="text-4xl my-8 leading-tighter font-medium xl:text-5xl xl:mb-12">
            A fumadocs template
          </h1>
          <div className="flex flex-row items-center justify-center gap-4 flex-wrap w-full">
            <Link href="/docs/en/components" className={cn(buttonVariants(), 'max-sm:text-sm')}>
              <Button>Getting Started</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
