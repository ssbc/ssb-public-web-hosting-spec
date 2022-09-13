# ssb-web-viewer-spec | v1

Scuttlebutt messages are by default not accessible from the world-wide-web.
In some cases sharing content from SSB to the web is desirable, and this is often done by running a scuttlebutt peer which
also responds to http queries.

This is a privacy concern as putting data on the web makes it easily scrapeable by corporations.

This spec defines the expected behaviour of such "viewers".

## 1. Opt-in only

Web viewers SHOULD NOT share peer data by default.

If a peer would like to make their content web-accessible, they are expected to **opt-in** by
publishing a message of format:

```js
{
   type: "about",
   about: FeedId, // must be the feedId of the author
   publicWebHosting: true
}
```

To subsequently opt out, publish a new message with content:

```js
{
   type: "about",
   about: FeedId, // must be the feedId of the author
   publicWebHosting: false
}
```

To know whether a peer has "opted in", look for the latest message which follows this format,
and if it exists AND `publicWebHosting === true` then they have opted in.

(see `schema.json` for a JSON-schema definition of this message type)

## 2. Serving a mixture of content

If a thread/ tangle is queried, and has been contributed to by a mixture of peers who have opted
in for public web hosting and those who have not, then the server MUST return empty placeholders
for messages from peers who have not opted in.

e.g.

```js
// an API response to a request for a thread that respects this spec
[
  {
    author: {
      feedId: '@DIoOBMaI1f0mJg+5tUzZ7vgzCeeHh8+zGta4pOjc+k0=.ed25519',
      name: 'Mix'
    },
    text: 'a thread about web-viewers',
    timestamp: 1663019986986
  },

  // message from a peer who has not opted in (or has opted out)
  {
    author: {}
    text: null,
    timestamp: null
  },

  {
    author: {
      feedId: '@DIoOBMaI1f0mJg+5tUzZ7vgzCeeHh8+zGta4pOjc+k0=.ed25519',
      name: 'Mix'
    },
    text: 'good point!'
    timestamp: 1663019984559
  }
]
```

## 3. No private messages

Private messages are encrypted, but still contain meta-data (such as author, ciphertext size,
time of publishing).

ALL queries on private messages or threads MUST respond with an error message.

