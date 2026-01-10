'use client'

import {
  SearchDialog,
  SearchDialogClose,
  SearchDialogContent,
  SearchDialogHeader,
  SearchDialogIcon,
  SearchDialogInput,
  SearchDialogList,
  SearchDialogOverlay,
  SearchDialogFooter,
  type SharedProps,
} from 'fumadocs-ui/components/dialog/search'
import { useDocsSearch } from 'fumadocs-core/search/client'
import { Popover, PopoverTrigger, PopoverContent } from 'fumadocs-ui/components/ui/popover'
import { buttonVariants } from 'fumadocs-ui/components/ui/button'
import { ChevronDown } from 'lucide-react'
import { create } from '@orama/orama'
import { createTokenizer } from '@orama/tokenizers/mandarin'
import { useI18n } from 'fumadocs-ui/contexts/i18n'
import { withBasePath } from '@/lib/env'
import { useState } from 'react'
import { cn } from '@/lib/cn'

const items = [
  {
    name: 'All',
    value: undefined,
  },
  {
    name: 'English',
    value: 'en',
    description: 'The English docs',
  },
  {
    name: 'Chinese',
    value: 'cn',
    description: 'The Chinese docs',
  },
]

function initOrama(locale?: string) {
  const res = create({
    schema: { _: 'string' },
    // https://docs.orama.com/docs/orama-js/supported-languages
    components: {
      tokenizer: locale === 'cn' ? createTokenizer() : undefined,
    },
  })
  return res
}

export default function DefaultSearchDialog(props: SharedProps) {
  const { locale } = useI18n() // (optional) for i18n
  const [open, setOpen] = useState(false)
  const [tag, setTag] = useState<string | undefined>()
  const { search, setSearch, query } = useDocsSearch({
    type: 'static',
    initOrama,
    locale: 'cn',
    from: withBasePath('/api/search'),
    tag,
  })

  return (
    <SearchDialog search={search} onSearchChange={setSearch} isLoading={query.isLoading} {...props}>
      <SearchDialogOverlay />
      <SearchDialogContent>
        <SearchDialogHeader>
          <SearchDialogIcon />
          <SearchDialogInput />
          <SearchDialogClose />
        </SearchDialogHeader>
        <SearchDialogList items={query.data !== 'empty' ? query.data : null} />
        <SearchDialogFooter className="flex flex-row flex-wrap gap-2 items-center">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger
              className={buttonVariants({
                size: 'sm',
                color: 'ghost',
                className: '-m-1.5 me-auto',
              })}
            >
              <span className="text-fd-muted-foreground/80 me-2">Filter</span>
              {items.find(item => item.value === tag)?.name}
              <ChevronDown className="size-3.5 text-fd-muted-foreground" />
            </PopoverTrigger>
            <PopoverContent className="flex flex-col p-1 gap-1" align="start">
              {items.map((item, i) => {
                const isSelected = item.value === tag

                return (
                  <button
                    key={i}
                    onClick={() => {
                      setTag(item.value)
                      setOpen(false)
                    }}
                    className={cn(
                      'rounded-lg text-start px-2 py-1.5',
                      isSelected
                        ? 'text-fd-primary bg-fd-primary/10'
                        : 'hover:text-fd-accent-foreground hover:bg-fd-accent',
                    )}
                  >
                    <p className="font-medium mb-0.5">{item.name}</p>
                    <p className="text-xs opacity-70">{item.description}</p>
                  </button>
                )
              })}
            </PopoverContent>
          </Popover>
          <a
            href="https://orama.com"
            rel="noreferrer noopener"
            target="_blank"
            className="text-xs text-nowrap text-fd-muted-foreground"
          >
            Powered by Orama
          </a>
        </SearchDialogFooter>
      </SearchDialogContent>
    </SearchDialog>
  )
}
