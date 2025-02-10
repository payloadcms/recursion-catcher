// storage-adapter-import-placeholder
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { opsCounterPlugin } from './plugins/OpsCounter'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    Users,
    Media,
    {
      slug: 'posts',
      hooks: {
        afterChange: [
          async ({ doc, req }) => {
            doc.updateCount = doc.updateCount + 1
            // This code will cause an infinite loop - when you update a post,
            // it will update itself, causing recursion.

            // The plugin within this repo will detect the loop and throw.
            await req.payload.update({
              id: doc.id,
              collection: 'posts',
              data: doc,
              // Note that the only way the plugin can detect the loop
              // is if we pass the req through
              req,
            })
          },
        ],
      },
      fields: [
        {
          name: 'updateCount',
          type: 'number',
        },
      ],
    },
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URI || '',
    },
  }),
  sharp,
  plugins: [
    payloadCloudPlugin(),
    // Install the plugin, configure max operations at 25
    // defaults to 50
    opsCounterPlugin({
      max: 25,
    }),
  ],
})
