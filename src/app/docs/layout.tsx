import { DocsLayout } from 'fumadocs-ui/layouts/docs'
import Image from 'next/image'
import { getSection, source } from '@/lib/source'
import { baseOptions } from '@/lib/layout.shared'
import logo from '@/app/icon.svg'

export default function Layout({ children }: LayoutProps<'/docs'>) {
  const base = baseOptions()

  return (
    <DocsLayout
      tree={source.getPageTree()}
      {...base}
      nav={{
        ...base.nav,
        title: (
          <>
            <Image src={logo} alt="logo" width={20} height={20} />
            <span className="font-medium in-[.uwu]:hidden max-md:hidden">Fumadocs Template</span>
          </>
        ),
      }}
      sidebar={{
        tabs: {
          transform(option, node) {
            const meta = source.getNodeMeta(node)
            if (!meta || !node.icon) return option
            const color = `var(--${getSection(meta.path)}-color, var(--color-fd-foreground))`

            return {
              ...option,
              icon: (
                <div
                  className="[&_svg]:size-full rounded-lg size-full text-(--tab-color) max-md:bg-(--tab-color)/10 max-md:border max-md:p-1.5"
                  style={
                    {
                      '--tab-color': color,
                    } as object
                  }
                >
                  {node.icon}
                </div>
              ),
            }
          },
        },
      }}
    >
      {children}
    </DocsLayout>
  )
}
