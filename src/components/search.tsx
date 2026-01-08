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
  type SharedProps,
} from 'fumadocs-ui/components/dialog/search'
import { useDocsSearch } from 'fumadocs-core/search/client'
import { create } from '@orama/orama'
import { createTokenizer } from '@orama/tokenizers/mandarin'
import { useI18n } from 'fumadocs-ui/contexts/i18n'
import { withBasePath } from '@/lib/env.mjs'

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
  const { search, setSearch, query } = useDocsSearch({
    type: 'static',
    initOrama,
    locale: 'cn',
    from: withBasePath('/api/search'),
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
      </SearchDialogContent>
    </SearchDialog>
  )
}
