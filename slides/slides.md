---
theme: nord
colorSchema: dark
title: "Stop Building Portals, Start Building Conversations"
author: Engin Diri & Hila Fish
info: |
  ## Stop Building Portals, Start Building Conversations
  The Paradigm Shift in Platform Engineering.
  Engin Diri (Pulumi) & Hila Fish (AWS)
highlighter: shiki
lineNumbers: true
transition: slide-left
layout: cover
---

<div class="absolute inset-0 flex flex-col justify-center items-start px-16 py-12">
  <div class="flex items-center gap-3 !mb-6">
    <span class="!text-[2.4rem]">&#9888;</span>
    <span class="tracking-[0.4em] uppercase !text-[1.2rem] !font-bold text-[var(--red)]">Warning</span>
  </div>
  <h1 class="!text-[4.0rem] !leading-[1.1] !font-semibold !tracking-tight !mb-6 !max-w-[95%]">
    The talk you're about to hear<br/>
    could be <span class="text-[var(--frost1)]">outdated</span><br/> the moment it's done.
  </h1>
  <p class="!mt-2 !text-[1.6rem] !m-0 italic opacity-60">
    because&hellip;
  </p>
</div>

<!--
~10s. Cold open. Read it deadpan. Pause on "because…" — that's the cliffhanger. Click into the meme.
-->

---
layout: default
---

<div class="absolute inset-0 bg-white flex items-center justify-center">
  <img src="/i-wake-up-claude-update.png" class="h-full w-auto object-contain" />
</div>

<!--
~5s. The punchline of "because…". Let the laugh land, then click into the title slide.
-->

---
layout: cover
---

<div class="absolute inset-0 flex flex-col justify-center items-start px-16 py-12">
  <h1 class="!text-[3.8rem] !leading-[1.05] !font-semibold !tracking-tight !mb-4 !max-w-[100%]">
    Stop Building Portals,<br/><span style="color: #8FBCBB;">Start Building</span> <strong style="color: #8FBCBB;">Conversations</strong>
  </h1>
  <p class="!mt-0 !text-[1.5rem] !m-0 !leading-snug opacity-70">
    The Paradigm Shift in Platform Engineering
  </p>
  <p class="!mt-14 !text-[2.0rem] !m-0 !leading-relaxed opacity-70">
    <strong>Engin Diri</strong> · Sr. Solutions Architect, Pulumi<br/>
    <strong>Hila Fish</strong> · Solutions Architect, AWS
  </p>
</div>

<div class="absolute bottom-6 left-16 flex items-center gap-2 !text-[1rem] opacity-70">
  <img src="/platforma-brand.jpg" class="w-6 h-6 rounded" />
  <span>PlatforMA 2026 · Tel Aviv</span>
</div>

<!--
Show of hands - who has built or maintained an internal developer portal?

Keep your hand up if adoption plateaued after a few months.

Yeah. That's why we're here today.
-->

---
layout: default
---

<div class="absolute inset-0 flex items-center px-20 gap-16">
  <div class="flex-shrink-0">
    <img src="/engin-diri.jpg" class="w-80 rounded-2xl shadow-xl border-4 border-[var(--frost1)]/30" />
  </div>
  <div class="flex-1">
    <h1 class="!text-[5rem] !leading-[1.02] !font-semibold !tracking-tight !mb-3">Engin Diri</h1>
    <p class="!text-[1.8rem] !leading-relaxed !m-0 opacity-80 whitespace-nowrap">
      Senior Solutions Architect at <strong>Pulumi</strong>
    </p>
    <div class="!mt-6 flex items-center gap-6 !text-[1.1rem] opacity-70">
      <span class="flex items-center gap-2"><carbon-logo-x /> @_ediri</span>
      <span class="flex items-center gap-2"><carbon-logo-linkedin /> engin-diri</span>
      <span class="flex items-center gap-2"><carbon-logo-github /> dirien</span>
    </div>
    <p class="!mt-8 !text-[1.25rem] !leading-relaxed opacity-70 !max-w-[100%] !m-0 whitespace-nowrap">
      Building platform tooling and infrastructure-as-code.<br>
      Helping teams ship cloud infrastructure faster.
    </p>
  </div>
</div>

<!--
I'm Engin. I build platform tooling at Pulumi. I've helped teams build portals, watched them succeed, and watched them fail.
-->

---
layout: default
---

<div class="absolute inset-0 flex items-center px-20 gap-16">
  <div class="flex-shrink-0">
    <img src="/hila-fish-headshot.png" class="w-80 rounded-2xl shadow-xl border-4 border-[var(--frost1)]/30" />
  </div>
  <div class="flex-1">
    <h1 class="!text-[5rem] !leading-[1.02] !font-semibold !tracking-tight !mb-3">Hila Fish</h1>
    <p class="!text-[1.8rem] !leading-relaxed !m-0 opacity-80">
      Solutions Architect at <strong>AWS</strong>
    </p>
    <div class="!mt-6 flex items-center gap-6 !text-[1.1rem] opacity-70">
      <span class="flex items-center gap-2"><carbon-logo-x /> @Hilafish1</span>
      <span class="flex items-center gap-2"><carbon-logo-linkedin /> hila-fish</span>
      <span class="flex items-center gap-2"><carbon-logo-github /> hilafish</span>
    </div>
    <p class="!mt-8 !text-[1.25rem] !leading-relaxed opacity-70 !max-w-[100%] !m-0 whitespace-nowrap">
       Helping teams ship AWS cloud infrastructure faster.<br/>
       Core organizer of DevOpsDays Tel-Aviv &amp;<br/>
       TLV Community events.<br/>
       <strong>Next event - 11.6.26 @ AWS Floor 28.</strong>
    </p>
  </div>
</div>

<!--
And I'm Hila. 15 years in infrastructure and DevOps. I've operated platforms at scale and I've seen what happens when you build something great that nobody uses.
-->

---

<div class="absolute inset-0 flex flex-col justify-center items-center px-20 text-center">
  <h1 class="!text-[7rem] !leading-tight !font-semibold !tracking-tight !m-0 !max-w-[95%]">
    <span class="text-[var(--frost1)]">אוקיי</span>, You Built an IDP
  </h1>
</div>

---
layout: default
---

# אוקיי, You Built an IDP

<div class="!max-w-[92%] mt-8 [&_p]:!text-[2.2rem] [&_p]:!leading-[1.35] [&_p]:!my-10">

You went to KubeCon. Saw a Backstage talk. <br> You got inspired.

<v-clicks>

Custom plugins. Service catalog. Golden paths. <br> **6 months later**, you have it all.

You launched it. Everyone's excited.

</v-clicks>

</div>

<!--
This is a story most platform engineers know by heart. You built something real. You solved real problems. And then developers stopped showing up.

But that's not even the full story. Something else happened while you were building that portal...
-->

---
layout: center
class: text-center
---

<div class="absolute inset-0 bg-black flex items-center justify-center">
  <img src="/godzilla-idp.png" class="h-full w-full object-contain" />
</div>

<!--
And then... AI happened. While you were perfecting your portal, developers discovered something new.
-->

---

<div class="absolute inset-0 flex flex-col justify-center items-center px-20 text-center">
  <h1 class="!text-[10rem] !leading-none !font-semibold !tracking-tight !m-0 text-[var(--frost1)]">
    84%
  </h1>
  <p class="!mt-8 !text-[2.2rem] !leading-relaxed !m-0 !max-w-[100%] whitespace-nowrap">
    of developers use / plan to use AI coding tools
  </p>
  <div class="!mt-14 flex gap-16 text-[1.3rem]">
    <v-click at="1"><div class="text-center"><strong class="!text-[2rem]">7.4</strong><br/><strong class="opacity-60">tools used daily</strong></div></v-click>
    <v-click at="3"><div class="text-center"><strong class="!text-[2rem]" style="font-weight: 900; color: #BF616A; -webkit-text-stroke: 1px #BF616A;">50%</strong><br/><strong style="color: #BF616A;">distrust their portal data</strong></div></v-click>
    <v-click at="2"><div class="text-center"><strong class="!text-[2rem]">13&times;/hr</strong><br/><strong class="opacity-60">context switches per dev</strong></div></v-click>
  </div>
</div>

<div class="absolute bottom-3 right-6 text-[0.55rem] opacity-40 text-right">
  Stack Overflow Developer Survey &middot; DevOps.com Tool Sprawl Survey &middot; Atlassian Developer Experience Report &middot; Port.io State of Internal Developer Portals
</div>

<!--
84% of developers now use or plan to use AI tools - Stack Overflow's 2025 survey. They're in Copilot, Claude Code, Cursor - inside their IDE and terminal. The average dev juggles 7.4 tools a day. Atlassian's 2025 Developer Experience Report - 3,500 engineers - found developers switch tasks 13 times per hour. Six minutes per task. And half of them flat-out don't trust the data in their portal anyway - Port.io's 2025 State of Internal Developer Portals.

Your portal is competing with tools developers already love. We solved "what to offer." We never solved "where to offer it."
-->

---
layout: default
---

<div class="absolute inset-0 overflow-hidden">

  <div class="absolute inset-0 flex flex-col justify-center items-center px-20 text-center" style="z-index: 1;">
    <h1 class="!text-[7rem] !leading-tight !font-semibold !tracking-tight !m-0 !max-w-[95%]">
      Your Developers <span class="text-[var(--frost1)]">Moved On</span>
    </h1>
  </div>

  <v-click>
    <logos-openai-icon class="absolute !text-[16rem] text-white" style="top: 3%; right: 8%; transform: rotate(5deg); z-index: 2; filter: brightness(0) invert(1);" />
  </v-click>
  <v-click>
    <logos-github-copilot class="absolute !text-[12.8rem]" style="bottom: 12%; right: 68%; transform: rotate(-7deg); z-index: 3;" />
  </v-click>
  <v-click>
    <simple-icons-windsurf class="absolute !text-[14rem] text-[#00D4AA]" style="top: -2%; left: 4%; transform: rotate(-4deg); z-index: 4;" />
  </v-click>
  <v-click>
    <logos-google-gemini class="absolute !text-[10.5rem]" style="top: 9%; right: 26%; transform: rotate(3deg); z-index: 5;" />
  </v-click>
  <v-click>
    <img src="/cursor-cube.png" class="absolute w-[18rem] h-auto" style="top: 42%; left: 60%; transform: rotate(-3deg); z-index: 6;" />
  </v-click>
  <v-click>
    <img src="/pulumi-neo.png" class="absolute w-[14rem] h-auto" style="top: 48%; left: 33%; transform: rotate(-6deg); z-index: 5;" />
  </v-click>  
  <v-click>
    <logos-claude-icon class="absolute !text-[22rem]" style="bottom: 12%; left: 2%; transform: rotate(3deg); z-index: 7;" />
  </v-click>
  <v-click>
    <img src="/kiro-ghost.png" class="absolute w-[18rem] h-auto kiro-float" style="bottom: 14%; right: 26%; z-index: 8;" />
  </v-click>

</div>

<!--
Your developers moved on. They live in Claude Code, Claude Desktop, Cursor, Kiro, Copilot, Codex. They're not switching to a portal tab anymore. They want the platform to come to them — inside the conversation they're already having.
-->


---

<div class="absolute inset-0 flex flex-col justify-center items-center px-20 text-center">
  <h1 class="!text-[7rem] !leading-tight !font-semibold !tracking-tight !m-0 !max-w-[95%]">
    And they will <span class="text-[var(--frost1)]">DEFINITELY</span><br/>not come back.
  </h1>
</div>

<!--
That's the part most platform teams haven't internalized yet. Once a developer's workflow lives inside an AI tool, they're not switching back to a portal tab for one more form. The conversation IS the workflow now.
-->

---

<div class="absolute inset-0 flex flex-col justify-center items-center px-20 text-center">
  <h1 class="!text-[7rem] !leading-tight !font-semibold !tracking-tight !m-0 !max-w-[95%]">
    AI changed <span class="text-[var(--frost1)]">how developers work.</span>
  </h1>
</div>

---
layout: default
---

<div class="absolute inset-0 overflow-hidden">

  <!-- Older thumbnails: visible from the start -->
  <img src="/thumbnails/cc-1.png" class="absolute w-80 rounded shadow-xl border-2 border-white/20" style="top: 6%; left: -2%; transform: rotate(-5deg); z-index: 1;" />
  <img src="/thumbnails/cc-2.png" class="absolute w-72 rounded shadow-xl border-2 border-white/20" style="top: 10%; left: 22%; transform: rotate(3deg); z-index: 2;" />
  <img src="/thumbnails/cc-3.png" class="absolute w-80 rounded shadow-xl border-2 border-white/20" style="top: 7%; right: 22%; transform: rotate(4deg); z-index: 1;" />
  <img src="/thumbnails/cc-4.png" class="absolute w-72 rounded shadow-xl border-2 border-white/20" style="top: 12%; right: -2%; transform: rotate(-3deg); z-index: 2;" />
  <img src="/thumbnails/cc-5.png" class="absolute w-80 rounded shadow-xl border-2 border-white/20" style="top: 48%; left: -2%; transform: rotate(3deg); z-index: 1;" />
  <img src="/thumbnails/cc-6.png" class="absolute w-72 rounded shadow-xl border-2 border-white/20" style="top: 52%; right: -2%; transform: rotate(-4deg); z-index: 1;" />

  <!-- Newest thumbnails: reveal on click, foreground -->
  <v-click>
    <img src="/thumbnails/cc-w19.png" class="absolute w-96 rounded shadow-2xl border-2 border-white/20" style="top: 22%; left: 8%; transform: rotate(-3deg); z-index: 5;" />
    <img src="/thumbnails/cc-w18.png" class="absolute w-96 rounded shadow-2xl border-2 border-white/20" style="top: 28%; left: 36%; transform: rotate(2deg); z-index: 6;" />
    <img src="/thumbnails/cc-w17.png" class="absolute w-96 rounded shadow-2xl border-2 border-white/20" style="top: 22%; right: 6%; transform: rotate(4deg); z-index: 5;" />
  </v-click>

  <div class="absolute bottom-6 left-0 right-0 text-center" style="z-index: 10;">
    <div class="text-white text-7xl font-bold" style="text-shadow: 3px 3px 12px rgba(0,0,0,0.9);">
      <v-click at="2"><span>The pace </span></v-click><v-click at="3"><span>doesn't </span></v-click><v-click at="4"><span>slow </span></v-click><v-click at="5"><span>down.</span></v-click>
    </div>
  </div>
</div>

<!--
Look at the pace. Behind me — Ultraplan, Monitor tool, /autofix-pr, Computer Use, /powerup — all shipped a few weeks back. (Click) Then in just the past two weeks — Plugins from URLs, claude project purge, /ultrareview landed too. This is where developers live now. And these tools need your platform data to be useful.
-->

---
layout: default
---

<div class="absolute inset-0 bg-black">
  <img src="/cj-overwhelmed.png" class="absolute inset-0 w-full h-full object-cover" />
  <v-click>
  <div class="absolute bottom-8 left-0 right-0 text-center">
    <span dir="rtl" class="!text-[3.6rem] !font-bold text-white drop-shadow-[0_3px_8px_rgba(0,0,0,0.9)]">
      CJ: אוי ויי
    </span>
  </div>
  </v-click>
</div>

<!--
~5s. The audience just saw the firehose of AI tool releases. This is the face. Let the laugh land.
-->

---

<div class="absolute inset-0 flex flex-col justify-center items-center px-20 text-center">
  <h1 class="!text-[5.5rem] !leading-[1.15] !font-semibold !tracking-tight !m-0 !max-w-[95%]">
    In 2026, our IDP needs<br/>to <span class="text-[var(--frost1)]">speak AI</span>.
  </h1>
</div>

---
layout: default
---


# Backstage isn't dying. It's becoming plumbing.

<v-click>
<p class="!text-[1.56rem] !leading-relaxed !mt-2 !mb-4 opacity-80">
You've seen the "Backstage is dead" posts.
</p>
</v-click>

<v-click>

<p class="!text-[1.092rem] !leading-relaxed !mt-2 !mb-4 opacity-80">
Meanwhile, v1.40 quietly shipped <code>@backstage/plugin-mcp-actions-backend</code>.
</p>

<div class="[&_pre]:!text-[1.25rem] [&_pre]:!leading-[1.2] [&_code]:!text-[1.15rem]">

```ts {all|none}
// Backstage v1.40 - your portal becomes an MCP server

import { createBackend } from '@backstage/backend-defaults';

const backend = createBackend();
backend.add(import('@backstage/plugin-mcp-actions-backend'));

// Every scaffolder action -> MCP tool
// Every catalog entity -> queryable from a conversation
backend.start();
```

</div>

</v-click>

<v-click>
<div class="absolute left-1/2 top-[60%] -translate-x-1/2 -translate-y-1/2 z-50 w-[80%] text-center" style="text-shadow: 0 3px 12px rgba(0,0,0,0.95), 0 0 4px rgba(0,0,0,0.9);">
  <div class="!text-[2.7rem] !font-bold !leading-relaxed text-white">
    The portal stopped being the interface.<br/>It became the backend agents query.
  </div>
</div>
</v-click>

<!--
Even Backstage — our northern star for building IDPs — has shifted. v1.40 shipped MCP support. The portal is no longer the interface. It's the data layer.
-->

---

<div class="absolute inset-0 flex flex-col items-center justify-center px-10">
  <div class="w-[945px] rounded-2xl border border-solid border-[var(--frost1)]/30 bg-[var(--slidev-bg-alt)] overflow-hidden shadow-2xl">
    <!-- Chat header -->
    <div class="px-6 py-4 border-b border-solid border-[var(--slidev-border)] bg-[var(--slidev-bg)] flex items-center gap-3">
      <mdi-robot class="!text-[1.6rem] text-[var(--frost2)]" />
      <span class="!text-[1.2rem] font-semibold opacity-70">PlatformOps Agent</span>
    </div>
    <!-- User message -->
    <div class="px-6 pt-5 pb-3">
      <div class="flex items-start gap-4">
        <mdi-account class="!text-[1.9rem] text-[var(--frost1)] mt-0.5" />
        <div class="rounded-xl bg-[var(--frost3)]/20 px-5 py-3 !text-[1.5rem]">
          Can you show me the service catalog?
        </div>
      </div>
    </div>
    <!-- Agent response: plain text -->
    <div class="px-6 pb-6 pt-3">
      <div class="flex items-start gap-4">
        <mdi-robot class="!text-[1.9rem] text-[var(--frost2)] mt-0.5" />
        <div class="flex-1 rounded-xl bg-[var(--slidev-bg)] px-5 py-4 font-mono !text-[1.28rem] opacity-80">
          5 services found: user-service (healthy), payment-api (healthy), notification-svc (degraded), api-gateway (healthy), auth-service (healthy)
        </div>
      </div>
    </div>
  </div>
  <v-click>
  <p class="!text-[1.93rem] !mt-12 !m-0 opacity-70 text-center">
    The agent is fine with this. <strong>But you're not an agent.</strong>
  </p>
  </v-click>
</div>

---

<div class="flex flex-col items-center justify-center h-full">

<h1 class="!text-[5rem] !leading-tight !font-semibold !tracking-tight !mb-12 text-center">Portal = <span style="color: #88C0D0;">Data</span> + <span class="opacity-50">UI</span></h1>

<div class="flex gap-16">
<v-click>
<div class="px-8 py-6 rounded-xl border-2 border-solid text-center" style="border-color: rgba(163, 190, 140, 0.5); background: rgba(163, 190, 140, 0.1);">
<div class="!text-[1.4rem] !font-bold mb-2" style="color: #A3BE8C;">Data layer</div>
<div class="!text-[1.2rem] opacity-80">Services, owners, SLOs, deploys, on-call</div>
<div class="!mt-4 !text-[1.5rem] !font-bold" style="color: #A3BE8C;">✓ Stays</div>
</div>
</v-click>
<v-click>
<div class="px-8 py-6 rounded-xl border-2 border-solid text-center" style="border-color: rgba(191, 97, 106, 0.5); background: rgba(191, 97, 106, 0.1);">
<div class="!text-[1.4rem] !font-bold mb-2" style="color: #BF616A;">UI layer</div>
<div class="!text-[1.2rem] opacity-80">The website you navigate to</div>
<div class="!mt-4 !text-[1.5rem] !font-bold" style="color: #BF616A;">This is what we need to rethink</div>
</div>
</v-click>
</div>

</div>

---

<div class="absolute inset-0 flex flex-col justify-center items-center px-20 text-center">
  <h1 class="!text-[7rem] !leading-tight !font-semibold !tracking-tight !m-0 !max-w-[95%]">
    <span class="text-[var(--frost1)]">So,</span> let's think for a second&hellip;
  </h1>
</div>

<!--
~5s. Pivot beat. Drop the overwhelm, slow the room down before the reframe.
-->

---
layout: default
---

<div class="absolute inset-0 bg-black flex items-center justify-center">
  <img src="/thinking-patrick.gif" class="h-full w-auto object-contain" />
</div>

<!--
~6s. Let the gif loop a couple of times. No words. The audience laughs, you give them space to actually think with you.
-->

---

<div class="absolute inset-0 flex flex-col justify-center items-center px-20 text-center">
  <h1 class="!text-[6.5rem] !leading-tight !font-semibold !tracking-tight !m-0 !max-w-[95%]">
    We're humans.<br/><span class="text-[var(--frost1)]">We still need visualizations.</span>
  </h1>
</div>

---
layout: default
---

<div class="absolute inset-0 flex items-center justify-center px-10">
  <div class="w-[840px] rounded-2xl border border-solid border-[var(--frost1)]/30 bg-[var(--slidev-bg-alt)] overflow-hidden shadow-2xl">
    <!-- Chat header -->
    <div class="px-6 py-4 border-b border-solid border-[var(--slidev-border)] bg-[var(--slidev-bg)] flex items-center gap-3">
      <mdi-robot class="!text-[1.44rem] text-[var(--frost2)]" />
      <span class="!text-[1.08rem] font-semibold opacity-70">PlatformOps Agent</span>
    </div>
    <!-- User message -->
    <div class="px-6 pt-5 pb-3">
      <div class="flex items-start gap-4">
        <mdi-account class="!text-[1.68rem] text-[var(--frost1)] mt-0.5" />
        <div class="rounded-xl bg-[var(--frost3)]/20 px-5 py-3 !text-[1.32rem]">
          Can you show me the service catalog?
        </div>
      </div>
    </div>
    <!-- Agent response: rendered UI -->
    <div class="px-6 pb-6 pt-3">
      <div class="flex items-start gap-4">
        <mdi-robot class="!text-[1.68rem] text-[var(--frost2)] mt-0.5" />
        <div class="flex-1 rounded-xl border-2 border-solid border-[var(--frost1)]/40 bg-[var(--slidev-bg)] p-5">
          <div class="text-[var(--frost1)] !text-[1.2rem] mb-3 font-semibold">Platform Service Catalog</div>
          <div class="grid grid-cols-2 gap-3">
            <div class="rounded p-3 !text-[1.08rem] bg-[var(--slidev-bg-alt)] border border-solid border-[var(--slidev-border)]">
              <div class="font-semibold">user-service</div>
              <div class="text-[var(--green)] !text-[0.9rem]">● healthy</div>
            </div>
            <div class="rounded p-3 !text-[1.08rem] bg-[var(--slidev-bg-alt)] border border-solid border-[var(--slidev-border)]">
              <div class="font-semibold">payment-api</div>
              <div class="text-[var(--green)] !text-[0.9rem]">● healthy</div>
            </div>
            <div class="rounded p-3 !text-[1.08rem] bg-[var(--slidev-bg-alt)] border border-solid border-[var(--slidev-border)]">
              <div class="font-semibold">notification-svc</div>
              <div class="text-[var(--yellow)] !text-[0.9rem]">● degraded</div>
            </div>
            <div class="rounded p-3 !text-[1.08rem] bg-[var(--slidev-bg-alt)] border border-solid border-[var(--slidev-border)]">
              <div class="font-semibold">api-gateway</div>
              <div class="text-[var(--green)] !text-[0.9rem]">● healthy</div>
            </div>
          </div>
          <div class="mt-4">
            <span class="px-3 py-1.5 bg-[var(--frost3)] text-white !text-[0.96rem] rounded">Deploy</span>
            <span class="px-3 py-1.5 bg-[var(--slidev-bg-alt)] !text-[0.96rem] rounded ml-2 border border-solid border-[var(--slidev-border)]">Details</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

---
layout: default
---

<div class="absolute inset-0 flex items-center justify-center px-10">
  <div class="w-[900px] rounded-2xl border border-solid border-[var(--frost1)]/30 bg-[var(--slidev-bg-alt)] overflow-hidden shadow-2xl">
    <!-- Chat header -->
    <div class="px-6 py-4 border-b border-solid border-[var(--slidev-border)] bg-[var(--slidev-bg)] flex items-center gap-3">
      <mdi-robot class="!text-[1.54rem] text-[var(--frost2)]" />
      <span class="!text-[1.15rem] font-semibold opacity-70">PlatformOps Agent</span>
    </div>
    <!-- User message -->
    <div class="px-6 pt-5 pb-3">
      <div class="flex items-start gap-4">
        <mdi-account class="!text-[1.8rem] text-[var(--frost1)] mt-0.5" />
        <div class="rounded-xl bg-[var(--frost3)]/20 px-5 py-3 !text-[1.4rem]">
          Deploy payment-api to staging
        </div>
      </div>
    </div>
    <!-- Agent response: streaming deploy -->
    <div class="px-6 pb-6 pt-3">
      <div class="flex items-start gap-4">
        <mdi-robot class="!text-[1.8rem] text-[var(--frost2)] mt-0.5" />
        <div class="flex-1 rounded-xl border-2 border-solid border-[var(--frost1)]/40 bg-[var(--slidev-bg)] p-5">
          <div class="text-[var(--frost1)] !text-[1.28rem] mb-4 font-semibold">Deploying payment-api → staging</div>
          <div class="space-y-3">
            <div class="flex items-center gap-3 !text-[1.18rem]">
              <span class="w-6 h-6 rounded-full bg-[var(--green)]/20 text-[var(--green)] flex items-center justify-center text-xs">✓</span>
              <span>Validating manifest</span>
            </div>
            <div class="flex items-center gap-3 !text-[1.18rem]">
              <span class="w-6 h-6 rounded-full bg-[var(--green)]/20 text-[var(--green)] flex items-center justify-center text-xs">✓</span>
              <span>Pushing image</span>
            </div>
            <div class="flex items-center gap-3 !text-[1.18rem]">
              <span class="w-6 h-6 rounded-full bg-[var(--yellow)]/20 text-[var(--yellow)] flex items-center justify-center text-xs animate-pulse">●</span>
              <span>Rolling out (2/3 replicas)</span>
            </div>
            <div class="flex items-center gap-3 !text-[1.18rem] opacity-40">
              <span class="w-6 h-6 rounded-full bg-[var(--slidev-border)] flex items-center justify-center text-xs">○</span>
              <span>Health check</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

---


<div class="absolute inset-0" style="background: #BABBBD;">
  <div class="absolute top-[18%] right-[6%] !text-[16rem] !leading-none !font-bold !tracking-tight text-gray-900" dir="rtl">רגע!</div>
  <img src="/hila-fish-headshot.png" class="absolute bottom-0 left-0 max-h-[70%]" />
</div>

<!--
Hila jumps in. "Rega" - the inside joke from our last talk. It means "wait a moment" or "hold on" in Hebrew. The Tel Aviv room will get it instantly. Used to pause before we tackle the elephant in the room - the question everyone in this audience is already thinking but might not ask out loud.
-->

---

<div class="absolute inset-0 flex flex-col justify-center items-center px-20 text-center">
  <h1 class="!text-[7.2rem] !leading-[1.05] !font-semibold !tracking-tight !m-0 whitespace-nowrap">
    But what about<br/><span class="text-[var(--frost1)]">Skills and CLIs?</span>
  </h1>
</div>

---
layout: two-cols-header
---


# Skills and MCP. Not Skills vs MCP.

<p class="!text-[1.4rem] !leading-relaxed !mt-2 !mb-4 opacity-80">
A skill can call your MCP server. They're different layers.
</p>

::left::

<v-click>
<h3 class="!text-[1.6rem] !mt-6 !mb-3">Skills, <code>CLAUDE.md</code>, slash commands</h3>
</v-click>

<div class="opacity-80 [&_ul]:list-disc [&_ul]:pl-4 [&_li]:!text-[1.2rem] [&_li]:!leading-[1.5] [&_li]:!my-2 -ml-4">

<v-clicks>

- Your own workflows and runbooks
- Project conventions, in the repo
- How your agent thinks for you
- Lives next to the code

</v-clicks>

</div>

<v-click>
<Admonition title="Reach for this when" color="indigo-light">
<div class="!text-[1.5rem] !font-bold !mt-4">Fast. Local. Yours.</div>
</Admonition>
</v-click>

::right::

<v-click>
<h3 class="!text-[1.6rem] !mt-6 !mb-3 ml-4">MCP server (built for your org)</h3>
</v-click>

<div class="opacity-80 [&_ul]:list-disc [&_ul]:pl-4 [&_li]:!text-[1.2rem] [&_li]:!leading-[1.5] [&_li]:!my-2 ml-4">

<v-clicks>

- One team serving the rest of engineering
- OAuth identity, audit trails, RBAC
- UI for the people who won't open a terminal
- Outlives whoever shipped it

</v-clicks>

</div>

<v-click>
<div class="ml-4">
<Admonition title="Reach for this when" color="emerald-light">
<div class="!text-[1.5rem] !font-bold !mt-4">You're not the user. Your org is.</div>
</Admonition>
</div>
</v-click>

<!--
Here's the elephant we promised. Plenty of devs are extending their agents with skills, CLAUDE.md, slash commands, and skipping MCP. So do you even need a protocol if a skill can do it? They're not exclusive. A skill can call your MCP tools. The reason platform teams still ship MCP servers: skills don't carry OAuth identity. They don't write audit trails. They don't render UI for the PM who won't open a terminal. And they don't outlive the person who wrote them. That's what the platform layer is for.
-->
---

<div class="absolute inset-0 flex flex-col justify-center items-center px-20 text-center">
  <h1 class="!text-[5.5rem] !leading-[1.1] !font-semibold !tracking-tight !m-0 !max-w-[95%]">
    What if AI could talk <span class="text-[var(--frost1)]">frontend</span> too?
  </h1>
</div>

---

<div class="absolute inset-0 flex flex-col justify-center items-center px-20 text-center">
  <h1 class="!text-[8rem] !leading-none !font-semibold !tracking-tight !m-0 text-[var(--frost1)]">
    MCP Apps
  </h1>
  <p class="!mt-6 !text-[1.6rem] !m-0 italic opacity-70">
    Formerly known as MCP UI
  </p>
</div>

<!--
This didn't come from a corporate lab. Two engineers started a side project. OpenAI independently validated the idea at DevDay. Anthropic and OpenAI co-authored the spec. Nine months later it shipped everywhere with 9 launch partners on day one - Amplitude, Asana, Box, Canva, Clay, Figma, Hex, monday.com, and Slack. Monday.com acqui-hired the founders.

That's how fast this moved.
-->


<!--
~5s. No words. The plot twist: this didn't come from a corporate lab. Let the meme land, then click into "Meet the Inventors".
-->

---
layout: default
---

# Two engineers. One side project. <span class="text-[var(--frost1)]">9 months.</span>

<div class="flex items-start gap-10 mt-6">
<div class="flex-shrink-0 w-[30%] flex flex-col gap-3">
<img src="/ido-liad-mcp-summit.jpg" class="w-full rounded-2xl shadow-xl border-4 border-[var(--frost1)]/30" />
<div class="!text-[0.85rem] opacity-50 text-center">Ido Salomon & Liad Yosef<br/>Co-creators of MCP Apps</div>
</div>
<div class="flex-1 [&_div]:!text-[1.3rem] [&_div]:!leading-[1.5] space-y-4">

<div><strong class="text-[var(--frost1)]">May 2025</strong>&nbsp;&nbsp;Start MCP-UI as a side project</div>

<v-clicks>

<div><strong class="text-[var(--frost2)]">Oct 2025</strong>&nbsp;&nbsp;OpenAI ships Apps SDK at DevDay,<br/>validates the approach</div>

<div><strong class="text-[var(--purple)]">Nov 2025</strong>&nbsp;&nbsp;SEP-1865 draft: Anthropic + OpenAI<br/>propose the spec together</div>

<div><strong class="text-[var(--green)]">Jan 2026</strong>&nbsp;&nbsp;Ships in Claude, ChatGPT, VS Code, Goose<br/><span class="opacity-70 !text-[1.1rem]">9 day-one partners: Amplitude, Asana, Box, Canva, Clay, Figma, Hex, monday.com, Slack</span></div>

</v-clicks>

<v-click>
<div class="!mt-7 !text-[1.15rem] italic opacity-70">Monday.com acqui-hired the founders.<br/><strong class="not-italic">Side project → industry standard in 9 months.</strong></div>
</v-click>

</div>
</div>

<!--
Two Israeli engineers started a side project. OpenAI validated the idea at DevDay. Anthropic and OpenAI co-authored the spec. Nine months later it shipped everywhere. Monday.com acqui-hired the founders.

That's how fast this moved.
-->


---

<div class="absolute inset-0 flex flex-col justify-center items-center px-20 text-center">
  <h1 class="!text-[7rem] !leading-tight !font-semibold !tracking-tight !m-0 !max-w-[95%]">
    How MCP Apps <span class="text-[var(--frost1)]">Work</span>
  </h1>
</div>

<!--
We've seen the before-and-after. Now let's open it up. Three phases: request, render, interact. Same MCP plumbing you already know, with two new primitives bolted on.
-->

---
layout: default
---

# How MCP Apps Work

<v-click>
<div class="!text-[1rem] opacity-60 tracking-[0.3em] uppercase !mt-1 !mb-4">Request &middot; Render &middot; Interact</div>
</v-click>

<div class="grid grid-cols-3 gap-3">

<v-click>
<div class="p-4 rounded-xl border border-solid border-[var(--frost1)]/30 bg-[var(--frost1)]/5">
  <div class="flex items-center gap-2 !mb-3">
    <div class="w-7 h-7 rounded-full bg-[var(--frost1)] text-[#2e3440] flex items-center justify-center !font-bold !text-[1.1rem]">1</div>
    <div class="!font-bold tracking-wide uppercase !text-[1rem] text-[#2e3440]">Request</div>
  </div>
  <div class="space-y-2 !text-[1rem] !leading-snug text-[#2e3440]">
    <div class="flex gap-2"><span class="opacity-50 flex-shrink-0">&rarr;</span><span>Developer asks: <span class="font-semibold" style="color: #9B1179;">"Show&nbsp;me&nbsp;the&nbsp;catalog"</span></span></div>
    <div class="flex gap-2"><span class="opacity-50 flex-shrink-0">&rarr;</span><span>LLM calls tool <span class="font-mono font-semibold" style="color: #F6DE3C;">show-catalog</span></span></div>
    <div class="flex gap-2"><span class="opacity-50 flex-shrink-0">&rarr;</span><span>Tool returns <span class="font-bold" style="color: #1C1173;">data</span> + pointer to <br> <span class="font-bold" style="color: #1C1173;">UI resource</span></span></div>
  </div>
</div>
</v-click>

<v-click>
<div class="p-4 rounded-xl border border-solid border-[var(--frost1)]/30 bg-[var(--frost1)]/5">
  <div class="flex items-center gap-2 !mb-3">
    <div class="w-7 h-7 rounded-full bg-[var(--frost1)] text-[#2e3440] flex items-center justify-center !font-bold !text-[1.1rem]">2</div>
    <div class="!font-bold tracking-wide uppercase !text-[1rem] text-[#2e3440]">Render</div>
  </div>
  <div class="space-y-2 !text-[1rem] !leading-snug text-[#2e3440]">
    <div class="flex gap-2"><span class="opacity-50 flex-shrink-0">&rarr;</span><span>Host fetches HTML from <span class="font-mono font-semibold" style="color: #F6DE3C;">ui://catalog/app.html</span></span></div>
    <div class="flex gap-2"><span class="opacity-60 flex-shrink-0">&rarr;</span><span>Renders in a <span class="font-bold" style="color: #1C1173;">sandboxed iframe</span></span></div>
    <div class="flex gap-2"><span class="opacity-50 flex-shrink-0">&rarr;</span><span>Inline in the conversation</span></div>
  </div>
</div>
</v-click>

<v-click>
<div class="p-4 rounded-xl border border-solid border-[var(--frost1)]/30 bg-[var(--frost1)]/5">
  <div class="flex items-center gap-2 !mb-3">
    <div class="w-7 h-7 rounded-full bg-[var(--frost1)] text-[#2e3440] flex items-center justify-center !font-bold !text-[1.1rem]">3</div>
    <div class="!font-bold tracking-wide uppercase !text-[1rem] text-[#2e3440]">Interact</div>
  </div>
  <div class="space-y-2 !text-[1rem] !leading-snug text-[#2e3440]">
    <div class="flex gap-2"><span class="opacity-50 flex-shrink-0">&rarr;</span><span>Developer clicks <span class="font-semibold" style="color: #9B1179;">"Deploy"</span> inside the UI</span></div>
    <div class="flex gap-2"><span class="opacity-50 flex-shrink-0">&rarr;</span><span>UI calls an <span class="font-bold" style="color: #1C1173;">app-only tool</span></span></div>
    <div class="flex gap-2"><span class="opacity-50 flex-shrink-0">&rarr;</span><span>Deployment runs, <br>UI updates inline</span></div>
  </div>
</div>
</v-click>

</div>

<div class="grid grid-cols-3 gap-5 !mt-5">

<v-click>
<div class="p-3 rounded-lg border border-solid border-[#A3BE8C]/60 bg-[#A3BE8C]/15">
  <div class="!text-[0.9rem] tracking-[0.2em] uppercase opacity-70 !mb-1">Two-part registration</div>
  <div class="!text-[1rem] !leading-snug"><strong>Tool</strong> returns data + <code>_meta.ui.resourceUri</code>. <strong>Resource</strong> serves the bundled HTML.</div>
</div>
</v-click>

<v-click>
<div class="p-3 rounded-lg border border-solid border-[#88C0D0]/60 bg-[#88C0D0]/15">
  <div class="!text-[0.9rem] tracking-[0.2em] uppercase opacity-70 !mb-1">App-only tools</div>
  <div class="!text-[1rem] !leading-snug">The UI can call them. The LLM <strong>cannot see</strong> them. User stays in control.</div>
</div>
</v-click>

<v-click>
<div class="p-3 rounded-lg border border-solid border-[#8FBCBB]/60 bg-[#8FBCBB]/15">
  <div class="!text-[0.9rem] tracking-[0.2em] uppercase opacity-70 !mb-1">Zero token cost</div>
  <div class="!text-[1rem] !leading-snug">UI ships as a resource, not as generated tokens. Cost stays flat.</div>
</div>
</v-click>

</div>

<!--
Two-part registration: tool and resource, linked by a URI. The tool returns data plus a pointer to the UI. The host fetches the HTML, renders it sandboxed. The UI can call app-only tools - tools the model can't see, only the user can trigger. All through secure postMessage. Zero token cost.
-->

---
layout: cover
---

<div class="absolute inset-0 flex flex-col justify-center items-start px-20">
  <h1 class="!text-[8rem] !leading-none !font-semibold !tracking-tight !mb-8 text-[var(--frost1)]">
    Demo
  </h1>
  <p class="!text-[2.4rem] !leading-relaxed !m-0 !max-w-[90%] opacity-80">
    Platform Service Catalog as an MCP App
  </p>
  <p class="!mt-4 !text-[1.6rem] !leading-relaxed !m-0 opacity-70">
    Browse services, view details, deploy to staging
  </p>
</div>

<!--
SWITCH TO TERMINAL. Start the MCP App server. Open Claude Desktop. "Show me the service catalog." The catalog renders inline. Click a service. Click Deploy. The entire Backstage workflow, zero context switches.
-->

---
layout: default
---

<div class="absolute inset-0 bg-black flex items-center justify-center">
  <img src="/thinking-patrick.gif" class="h-full w-auto object-contain" />
</div>

<!--
Transition: "MCP Apps works today. But what about UI the agent composes on the fly — UI that doesn't exist until you ask for it?"
-->

---

<div class="absolute inset-0 flex flex-col justify-center items-center px-20 text-center">
  <h1 class="!text-[6.5rem] !leading-tight !font-semibold !tracking-tight !m-0 !max-w-[95%]">
    The future is <span class="text-[var(--frost1)]">Agentic UIs</span>
  </h1>
</div>

---

<div class="absolute inset-0 flex flex-col justify-start items-start px-14 pt-8">
  <h1 class="!text-[4rem] !leading-[1.2] !font-semibold !tracking-tight !mb-3">
    A2UI: <span class="text-[var(--frost1)]">a bet on the future</span>
  </h1>

  <v-click>
  <p class="!text-[1.5rem] !leading-relaxed !m-0 opacity-80 !max-w-[85%] !mb-8">
    What if the agent could describe the UI as <strong>data</strong>, and any host renders it natively?
  </p>
  </v-click>

  <v-click>
  <div class="!max-w-[85%] space-y-4">
    <div class="flex items-start gap-4">
      <span class="text-[var(--frost1)] !text-[1.3rem] mt-1">●</span>
      <span class="!text-[1.3rem]">Agent emits a UI spec as JSON</span>
    </div>
    <div class="flex items-start gap-4">
      <span class="text-[var(--frost1)] !text-[1.3rem] mt-1">●</span>
      <span class="!text-[1.3rem]">Host renders it with native components (React, SwiftUI, email, PDF)</span>
    </div>
    <div class="flex items-start gap-4">
      <span class="text-[var(--frost1)] !text-[1.3rem] mt-1">●</span>
      <span class="!text-[1.3rem]">Google-backed (ADK), v0.9 spec shipped 2026</span>
    </div>
  </div>
  </v-click>

  <div class="!mt-10 px-5 py-4 rounded-xl border-2 border-solid border-[var(--yellow)]/50 bg-[var(--yellow)]/10 !max-w-[55%] [&:not(:has(.slidev-vclick-current,.slidev-vclick-prior))]:!hidden" style="color: #2e3440; direction: ltr; text-align: left;">
    <v-clicks>
    <p class="!text-[1.1rem] !m-0 !leading-relaxed" style="direction: ltr; text-align: left;">
      MCP Apps: You build pages once,<br/>agent serves them inside the conversation.
    </p>
    <p class="!text-[1.1rem] !mt-3 !mb-0 !leading-relaxed" style="direction: ltr; text-align: left;">
      A2UI: You ask something → Agent builds<br/>the page on the fly. No one pre-built it.
    </p>
    </v-clicks>
  </div>

  <v-click>
  <div class="absolute bottom-6 right-10 max-w-[26rem] rotate-[2deg] px-3 py-4 rounded-xl border-1 border-solid border-[#d08770] bg-[#d08770] text-[#2e3440] shadow-xl !text-[1.11rem] !leading-snug z-10" style="direction: ltr; text-align: left;">
    <strong>Why "the future" on not now?</strong> <br>No major host supports A2UI natively today, none render A2UI specs yet. <br>But this is where agentic UI is heading (we think)
  </div>
  </v-click>
</div>

<!--
A2UI is the next step after MCP Apps. Instead of shipping pre-built HTML, the agent describes the UI as structured data and the host renders it natively. The spec exists, Google backs it, but adoption by major hosts hasn't happened yet. It's a bet — and we think it's a good one.
-->

---
layout: default
---

# הדוגמה

<div class="grid grid-cols-[0.7fr_1.6fr] gap-5 items-start">

<v-click>
<div class="flex flex-col items-center">
  <div class="!text-[0.72rem] tracking-[0.25em] uppercase opacity-60 !mb-2">Rendered natively by the host</div>
  <img src="/a2ui-pagerduty-form.png" class="max-h-[370px] w-auto rounded-xl shadow-2xl border-2 border-[var(--frost1)]/30 bg-white" />
</div>
</v-click>

<v-click>
<div class="space-y-2 min-w-0">

<div class="!text-[0.72rem] tracking-[0.25em] uppercase opacity-60">Components</div>

<div class="[&_pre]:!text-[0.44rem] [&_pre]:!leading-[1.5] [&_pre]:!my-0 [&_pre]:!max-h-[300px] [&_pre]:!overflow-auto [&_pre_*]:!text-[0.44rem] [&_pre_*]:!leading-[1.5] [&_code]:!text-[0.44rem] [&_code]:!leading-[1.5] [&_.line]:!text-[0.44rem] [&_.line]:!leading-[1.5]">

```json {lines:false}
[
  {
    "id": "root",
    "component": "Card",
    "child": "main-column"
  },
  {
    "id": "main-column",
    "component": "Column",
    "children": [
      "header-row",
      "service-picker",
      "title-field",
      "urgency-picker",
      "from-field",
      "extra-details-field",
      "share-checkbox",
      "execute-button"
    ],
    "align": "stretch"
  },
  {
    "id": "header-row",
    "component": "Row",
    "children": ["header-icon", "header-text"],
    "align": "center"
  },
  {
    "id": "header-icon",
    "component": "Icon",
    "name": "warning"
  },
  {
    "id": "header-text",
    "component": "Text",
    "text": "Trigger PagerDuty Incident",
    "variant": "h3"
  },
  {
    "id": "service-picker",
    "component": "ChoicePicker",
    "label": "Service*",
    "value": [],
    "options": [
      { "label": "Service A", "value": "service-a" },
      { "label": "Service B", "value": "service-b" },
      { "label": "Service C", "value": "service-c" }
    ],
    "variant": "mutuallyExclusive"
  },
  {
    "id": "title-field",
    "component": "TextField",
    "label": "Title*",
    "value": "",
    "variant": "shortText"
  },
  {
    "id": "urgency-picker",
    "component": "ChoicePicker",
    "label": "Urgency*",
    "value": ["high"],
    "options": [
      { "label": "High", "value": "high" },
      { "label": "Low",  "value": "low"  }
    ],
    "variant": "mutuallyExclusive"
  },
  {
    "id": "from-field",
    "component": "TextField",
    "label": "From*",
    "value": "Taylor (Platform)",
    "variant": "shortText",
    "checks": [
      {
        "condition": {
          "call": "required",
          "args": { "value": { "path": "/from" } }
        },
        "message": "From is required"
      }
    ]
  },
  {
    "id": "extra-details-field",
    "component": "TextField",
    "label": "Extra Details",
    "value": "",
    "variant": "longText"
  },
  {
    "id": "share-checkbox",
    "component": "CheckBox",
    "label": "Share",
    "value": false
  },
  {
    "id": "execute-button-text",
    "component": "Text",
    "text": "Execute"
  },
  {
    "id": "execute-button",
    "component": "Button",
    "child": "execute-button-text",
    "action": {
      "event": { "name": "triggerIncident" }
    }
  }
]
```

</div>

<div class="!text-[0.72rem] tracking-[0.25em] uppercase opacity-60 !mt-2">Data</div>

<div class="[&_pre]:!text-[0.57rem] [&_pre]:!leading-[1.5] [&_pre]:!my-0 [&_pre_*]:!text-[0.57rem] [&_pre_*]:!leading-[1.5] [&_code]:!text-[0.57rem] [&_code]:!leading-[1.5] [&_.line]:!leading-[1.5]">

```json {lines:false}
{
  "from": "Taylor (Platform)"
}
```

</div>

</div>
</v-click>

</div>

<!--
Concrete A2UI shape: a JSON tree of typed components (Card, Column, Row, ChoicePicker, TextField, CheckBox, Button) plus a tiny data object. The agent never ships HTML — the host owns the components and renders the same spec natively in React, SwiftUI, email, PDF. Same spec, any surface.
-->

---
layout: two-cols-header
---


# Recap: From Destination to Delivery

<p class="!text-[1.3rem] !leading-relaxed !mt-2 !mb-5 opacity-80 !max-w-[92%] italic">
Portals - places you go to. &nbsp;&nbsp; Conversations - the portal comes to you.
</p>

::left::

<v-click>

<h3 class="!text-[1.6rem] !mt-2 !mb-3">The Destination</h3>

<div class="opacity-70 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:!text-[1.1rem] [&_li]:!leading-[1.45] [&_li]:!my-1">

1. Open portal bookmark
2. Log in (again)
3. Find service catalog
4. Scroll to find your service
5. Click into detail page
6. Fill deployment form
7. Submit, switch back to IDE
8. Wait for Slack notification

</div>

<Admonition title="8 steps, 4 context switches" color="red-light" />

</v-click>

::right::

<v-click>

<h3 class="!text-[1.6rem] !mt-2 !mb-3">The Delivery</h3>

<div class="rounded-xl border border-solid border-[var(--frost1)]/30 bg-[var(--slidev-bg-alt)] overflow-hidden mt-2">
  <div class="px-3 py-2 border-b border-solid border-[var(--slidev-border)] bg-[var(--slidev-bg)] flex items-center gap-2">
    <mdi-robot class="!text-[1.1rem] text-[var(--frost2)]" />
    <span class="!text-[0.85rem] font-semibold opacity-70">Agent</span>
  </div>
  <div class="px-3 pt-2 pb-1">
    <div class="flex items-start gap-2">
      <mdi-account class="!text-[1.1rem] text-[var(--frost1)] mt-0.5" />
      <div class="rounded-lg bg-[var(--frost3)]/20 px-2 py-1 !text-[1rem]">Deploy payment-api to staging</div>
    </div>
  </div>
  <div class="px-3 pb-2 pt-1">
    <div class="flex items-start gap-2">
      <mdi-robot class="!text-[1.1rem] text-[var(--frost2)] mt-0.5" />
      <div class="flex-1 rounded-lg border border-solid border-[var(--frost1)]/30 bg-[var(--slidev-bg)] p-2 !text-[0.9rem]">
        <div class="text-[var(--frost1)] font-semibold mb-1">Deploying payment-api → staging</div>
        <div class="flex items-center gap-1"><span class="text-[var(--green)]">✓</span> Validate</div>
        <div class="flex items-center gap-1"><span class="text-[var(--green)]">✓</span> Push</div>
        <div class="flex items-center gap-1"><span class="text-[var(--green)]">✓</span> Roll out</div>
        <div class="flex items-center gap-1"><span class="text-[var(--green)]">✓</span> Health check</div>
      </div>
    </div>
  </div>
</div>

<Admonition title="1 sentence, 0 context switches" color="emerald-light" />

</v-click>

<!--
Recap. Same operation, two paradigms. The portal was a destination — you had to go to it. MCP Apps delivers the platform inside the conversation. A2UI will take it further — agent-composed UI, natively rendered, wherever the developer already is. The portal didn't die. It became the backend.
-->

---
layout: default
---


# What to do Sunday morning

<p class="!text-[1.3rem] !leading-relaxed !mt-2 !mb-6 opacity-80 !max-w-[92%]">
4 moves your platform team can do.
</p>

<div class="grid grid-cols-2 gap-5">

<v-click>
<div class="px-5 py-2 rounded-xl border border-solid h-full" style="border-color: rgba(136, 192, 208, 0.5); background: rgba(136, 192, 208, 0.08);">
<div class="!text-[2rem] !font-bold !leading-none !m-0" style="color: var(--frost1);">01</div>
<div class="!text-[1.2rem] !font-bold !mt-1 !mb-2">Audit your portal</div>
<p class="!text-[1.05rem] !leading-snug !m-0 opacity-80">Find the right workflows - those safe to experiment with & the ones that need a new interface most.</p>
</div>
</v-click>

<v-click>
<div class="px-5 py-2 rounded-xl border border-solid h-full" style="border-color: rgba(163, 190, 140, 0.5); background: rgba(163, 190, 140, 0.08);">
<div class="!text-[2rem] !font-bold !leading-none !m-0" style="color: var(--green);">02</div>
<div class="!text-[1.2rem] !font-bold !mt-1 !mb-2">Build one MCP server</div>
<p class="!text-[1.05rem] !leading-snug !m-0 opacity-80">Start with the service catalog or deploying a service.</p>
</div>
</v-click>

<v-click>
<div class="px-5 py-2 rounded-xl border border-solid h-full" style="border-color: rgba(235, 203, 139, 0.5); background: rgba(235, 203, 139, 0.08);">
<div class="!text-[2rem] !font-bold !leading-none !m-0" style="color: var(--yellow);">03</div>
<div class="!text-[1.2rem] !font-bold !mt-1 !mb-2">Ship an MCP App</div>
<p class="!text-[1.05rem] !leading-snug !m-0 opacity-80">Add UI to your MCP server. Track adoption,<br>time-to-action, and completion rate vs the portal.</p>
</div>
</v-click>

<v-click>
<div class="px-5 py-2 rounded-xl border border-solid h-full" style="border-color: rgba(180, 142, 173, 0.5); background: rgba(180, 142, 173, 0.08);">
<div class="!text-[2rem] !font-bold !leading-none !m-0" style="color: var(--purple);">04</div>
<div class="!text-[1.2rem] !font-bold !mt-1 !mb-2">Explore A2UI</div>
<p class="!text-[1.05rem] !leading-snug !m-0 opacity-80">MCP Apps - today. Prototype one workflow with A2UI. When hosts catch up, you'll be ready.</p>
</div>
</v-click>

</div>

<!--
Four moves for Monday. Audit the portal workflows nobody uses - those are your MCP candidates. Build one MCP server around 250 lines, our demo is that small. Measure against the portal, especially time-to-action. And plan for the stack. Remember the Backstage slide - your portal isn't dying, it's becoming the plumbing under your MCP server. Same catalog, new interface.
-->

---

<div class="absolute inset-0 flex flex-col justify-center items-center px-20 text-center">
  <h1 class="!text-[12rem] !leading-none !font-semibold !tracking-tight !m-0">
    ID<span class="relative inline-block"><span v-mark.strike-through.red="1" class="transition-opacity duration-500" :class="$clicks >= 2 ? 'opacity-30' : ''">P</span><v-click at="2"><span class="absolute inset-0 text-[var(--frost1)]">C</span></v-click></span>
  </h1>
  <p class="!mt-8 !text-[2.8rem] !m-0 opacity-60 whitespace-nowrap">
    Internal Developer <span v-mark.strike-through.red="1" class="transition-opacity duration-500" :class="$clicks >= 2 ? 'opacity-30' : ''">Portal</span> <v-click at="2"><span class="text-[var(--frost1)]">Conversations</span></v-click>
  </p>
</div>

---

<div class="absolute inset-0 flex flex-col justify-center items-center px-20 text-center">
  <h1 class="!text-[6rem] !leading-tight !font-semibold !tracking-tight !m-0 !max-w-[95%]">
    Stop Building Portals.<br/>
    Start Building <span v-mark.circle.yellow="1" class="text-[var(--frost1)]">Conversations</span>.
  </h1>
</div>

<!--
Your portal isn't dead. It's your catalog of record, your golden paths, your agent gateway. But it is no longer the primary interface. The conversation is.

Thank you.
-->


<!--
Open it up for questions. If there's time, we can also show specific parts of the demo again or dive deeper into any of the GenUI approaches.
-->

---
layout: default
---

<div class="absolute inset-0 flex flex-col justify-center items-center px-20">
  <div class="opacity-80 tracking-[0.6em] uppercase !text-[2rem] !mb-4">Thank you</div>
  <h1 class="!text-[3.6rem] !leading-[1.02] !font-semibold !tracking-tight !mb-12 text-center">
    Stay in <span class="text-[var(--frost1)]">conversation.</span>
  </h1>

  <div class="flex gap-16 justify-center items-start">
    <div class="text-center">
      <img src="/engin-diri.jpg" class="w-28 rounded-full mx-auto mb-3 border-4 border-[var(--frost1)]/30" />
      <div class="!text-[1.4rem] !font-bold">Engin Diri</div>
      <div class="opacity-60 !text-[1rem]">Pulumi</div>
      <div class="flex items-center justify-center gap-3 mt-2 !text-[0.95rem] opacity-50">
        <span class="flex items-center gap-1"><carbon-logo-github /> dirien</span>
        <span class="flex items-center gap-1"><carbon-logo-linkedin /> engin-diri</span>
      </div>
      <div class="mt-4 bg-white rounded-lg p-2 inline-block">
        <QRCode value="https://www.linkedin.com/in/engin-diri/" :size="110" render-as="svg" />
      </div>
    </div>
    <div class="text-center">
      <img src="/hila-fish-headshot.png" class="w-28 rounded-full mx-auto mb-3 border-4 border-[var(--frost1)]/30" />
      <div class="!text-[1.4rem] !font-bold">Hila Fish</div>
      <div class="opacity-60 !text-[1rem]">AWS</div>
      <div class="flex items-center justify-center gap-3 mt-2 !text-[0.95rem] opacity-50">
        <span class="flex items-center gap-1"><carbon-logo-github /> hilafish</span>
        <span class="flex items-center gap-1"><carbon-logo-linkedin /> hila-fish</span>
      </div>
      <div class="mt-4 bg-white rounded-lg p-2 inline-block">
        <QRCode value="https://www.linkedin.com/in/hila-fish/" :size="110" render-as="svg" />
      </div>
    </div>
    <div class="text-center">
      <div class="w-28 h-28 rounded-full mx-auto mb-3 border-4 border-[var(--yellow)]/30 flex items-center justify-center">
        <carbon-logo-github class="text-5xl" />
      </div>
      <div class="!text-[1.4rem] !font-bold">Slides + Demo</div>
      <div class="opacity-60 !text-[1rem]">&nbsp;</div>
      <div class="mt-2 !text-[0.95rem] opacity-0">&nbsp;</div>
      <div class="mt-4 bg-white rounded-lg p-2 inline-block">
        <QRCode value="https://github.com/dirien/stop-building-portals-start-building-conversations" :size="110" render-as="svg" />
      </div>
    </div>
  </div>
</div>

<!--
Thank you! Scan the QR codes to connect on LinkedIn or grab the slides and demo code from the repo.
-->
