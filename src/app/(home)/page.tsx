import Link from 'next/link'
import { Cards, Card } from 'fumadocs-ui/components/card'

export default function HomePage() {
  return (
    <div className="flex flex-col justify-center text-center flex-1">
      <h1 className="text-2xl font-bold mb-4">Hello World</h1>
      <p>
        You can open{' '}
        <Link href="/docs/components" className="font-medium underline">
          /docs/components
        </Link>{' '}
        and see the documentation.
      </p>

      <Cards className="mt-8 flex justify-center">
        <Card title="Learn more about Next.js" href="https://nextjs.org/docs" />
        <Card title="Learn more about Fumadocs" href="https://fumadocs.dev" />
      </Cards>
    </div>
  )
}
