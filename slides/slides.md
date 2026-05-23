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
  <h1 class="!text-[3.4rem] !leading-[1.1] !font-semibold !tracking-tight !mb-6 !max-w-[95%]">
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
    Stop Building Portals,<br/>Start Building <strong>Conversations</strong>
  </h1>
  <p class="!mt-0 !text-[1.5rem] !m-0 !leading-snug opacity-70">
    The Paradigm Shift in Platform Engineering.
  </p>
  <p class="!mt-14 !text-[1.43rem] !m-0 !leading-relaxed opacity-70">
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
    <p class="!mt-8 !text-[1.25rem] !leading-relaxed opacity-70 !max-w-[90%] !m-0">
      Building platform tooling and infrastructure-as-code.
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
    <p class="!mt-8 !text-[1.25rem] !leading-relaxed opacity-70 !max-w-[90%] !m-0">
       Helps ship AWS cloud infrastructure faster.<br/>
       Core organizer of DevOpsDays Tel-Aviv &amp;<br/>
       TLV Community events.<br/>
       Next event - 11.6.26 @ AWS Floor 28.
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
  <h1 class="!text-[10rem] !leading-none !font-semibold !tracking-tight !m-0">
    <span style="color: #BF616A;">We all</span> <span class="text-[var(--frost1)]">know</span> <span style="color: #BF616A;">why</span>
  </h1>
</div>

<!--
Pause. Let it hang. Then click forward.
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

<div class="absolute inset-0 flex flex-col items-center justify-center px-16">
  <div class="w-[700px] rounded-2xl border border-solid border-[var(--frost1)]/30 bg-[var(--slidev-bg-alt)] overflow-hidden shadow-2xl">
    <!-- Chat header -->
    <div class="px-5 py-3 border-b border-solid border-[var(--slidev-border)] bg-[var(--slidev-bg)] flex items-center gap-2">
      <mdi-robot class="!text-[1.2rem] text-[var(--frost2)]" />
      <span class="!text-[0.9rem] font-semibold opacity-70">PlatformOps Agent</span>
    </div>
    <!-- User message -->
    <div class="px-5 pt-4 pb-2">
      <div class="flex items-start gap-3">
        <mdi-account class="!text-[1.4rem] text-[var(--frost1)] mt-0.5" />
        <div class="rounded-xl bg-[var(--frost3)]/20 px-4 py-2 !text-[1.1rem]">
          Can you show me the software catalog?
        </div>
      </div>
    </div>
    <!-- Agent response: plain text -->
    <div class="px-5 pb-5 pt-2">
      <div class="flex items-start gap-3">
        <mdi-robot class="!text-[1.4rem] text-[var(--frost2)] mt-0.5" />
        <div class="flex-1 rounded-xl bg-[var(--slidev-bg)] px-4 py-3 font-mono !text-[0.95rem] opacity-80">
          5 services found: user-service (healthy), payment-api (healthy), notification-svc (degraded), api-gateway (healthy), auth-service (healthy)
        </div>
      </div>
    </div>
  </div>
  <p class="!text-[1.43rem] !mt-6 !m-0 opacity-70 text-center">
    The agent is fine with this. But you're not an agent.
  </p>
</div>

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
~5s. No words. The audience just saw the firehose of features. This is the face. Let the laugh land, then click into the pivot.
-->

---

<div class="absolute inset-0 flex flex-col justify-center items-center px-20 text-center">
  <h1 class="!text-[7rem] !leading-tight !font-semibold !tracking-tight !m-0 !max-w-[95%]">
    <span class="text-[var(--frost1)]">But,</span> let's think a second&hellip;
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
    We're humans.<br/><span class="text-[var(--frost1)]">We need visualizations.</span>
  </h1>
</div>

---
layout: default
---

<div class="absolute inset-0 flex items-center justify-center px-16">
  <div class="w-[700px] rounded-2xl border border-solid border-[var(--frost1)]/30 bg-[var(--slidev-bg-alt)] overflow-hidden shadow-2xl">
    <!-- Chat header -->
    <div class="px-5 py-3 border-b border-solid border-[var(--slidev-border)] bg-[var(--slidev-bg)] flex items-center gap-2">
      <mdi-robot class="!text-[1.2rem] text-[var(--frost2)]" />
      <span class="!text-[0.9rem] font-semibold opacity-70">PlatformOps Agent</span>
    </div>
    <!-- User message -->
    <div class="px-5 pt-4 pb-2">
      <div class="flex items-start gap-3">
        <mdi-account class="!text-[1.4rem] text-[var(--frost1)] mt-0.5" />
        <div class="rounded-xl bg-[var(--frost3)]/20 px-4 py-2 !text-[1.1rem]">
          Can you show me the software catalog?
        </div>
      </div>
    </div>
    <!-- Agent response: rendered UI -->
    <div class="px-5 pb-5 pt-2">
      <div class="flex items-start gap-3">
        <mdi-robot class="!text-[1.4rem] text-[var(--frost2)] mt-0.5" />
        <div class="flex-1 rounded-xl border-2 border-solid border-[var(--frost1)]/40 bg-[var(--slidev-bg)] p-4">
          <div class="text-[var(--frost1)] !text-[1rem] mb-3 font-semibold">Platform Service Catalog</div>
          <div class="grid grid-cols-2 gap-2">
            <div class="rounded p-2 !text-[0.9rem] bg-[var(--slidev-bg-alt)] border border-solid border-[var(--slidev-border)]">
              <div class="font-semibold">user-service</div>
              <div class="text-[var(--green)] !text-[0.75rem]">● healthy</div>
            </div>
            <div class="rounded p-2 !text-[0.9rem] bg-[var(--slidev-bg-alt)] border border-solid border-[var(--slidev-border)]">
              <div class="font-semibold">payment-api</div>
              <div class="text-[var(--green)] !text-[0.75rem]">● healthy</div>
            </div>
            <div class="rounded p-2 !text-[0.9rem] bg-[var(--slidev-bg-alt)] border border-solid border-[var(--slidev-border)]">
              <div class="font-semibold">notification-svc</div>
              <div class="text-[var(--yellow)] !text-[0.75rem]">● degraded</div>
            </div>
            <div class="rounded p-2 !text-[0.9rem] bg-[var(--slidev-bg-alt)] border border-solid border-[var(--slidev-border)]">
              <div class="font-semibold">api-gateway</div>
              <div class="text-[var(--green)] !text-[0.75rem]">● healthy</div>
            </div>
          </div>
          <div class="mt-3">
            <span class="px-2 py-1 bg-[var(--frost3)] text-white !text-[0.8rem] rounded">Deploy</span>
            <span class="px-2 py-1 bg-[var(--slidev-bg-alt)] !text-[0.8rem] rounded ml-1 border border-solid border-[var(--slidev-border)]">Details</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

---


<div class="absolute inset-0" style="background: #BABBBD;">
  <div class="absolute top-[18%] right-[6%] !text-[16rem] !leading-none !font-bold !tracking-tight text-gray-900" dir="rtl">רגע!!!</div>
  <img src="/hila-fish-headshot.png" class="absolute bottom-0 left-0 max-h-[70%]" />
</div>

<!--
Hila jumps in. "Rega" - the inside joke from our last talk. It means "wait a moment" or "hold on" in Hebrew. The Tel Aviv room will get it instantly. Used to pause before we tackle the elephant in the room - the question everyone in this audience is already thinking but might not ask out loud.
-->

---

<div class="absolute inset-0 flex flex-col justify-center items-center px-20 text-center">
  <h1 class="!text-[5.5rem] !leading-[1.05] !font-semibold !tracking-tight !m-0 !max-w-[95%]">
    But what about<br/><span class="text-[var(--frost1)]">Skills and CLIs?</span>
  </h1>
</div>

---
layout: two-cols-header
---


# But isn't everyone moving to Skills and CLIs?

<p class="!text-[1.56rem] !leading-relaxed !mt-2 !mb-4 opacity-80">
Yes & no. Depends on who you build it for.
</p>

::left::

<v-click>
<h3 class="!text-[1.5rem] !mt-2 !mb-3">Skills + CLI win for</h3>
</v-click>

<div class="opacity-80 [&_ul]:list-disc [&_ul]:pl-6 [&_li]:!text-[1.1rem] [&_li]:!leading-[1.5] [&_li]:!my-2">

<v-clicks>

- Your own workflows
- Project conventions and runbooks
- Customizing how your agent thinks for you
- Anything that fits in a `SKILL.md` file

</v-clicks>

</div>

<v-click>
<Admonition title="The individual layer" color="indigo-light">
<div class="!text-[1.7rem] !font-bold !mt-6">Fast. Local. Yours.</div>
</Admonition>
</v-click>

::right::

<v-click>
<h3 class="!text-[1.5rem] !mt-2 !mb-3">Protocols win for</h3>
</v-click>

<div class="opacity-80 [&_ul]:list-disc [&_ul]:pl-6 [&_li]:!text-[1rem] [&_li]:!leading-[1.5] [&_li]:!my-2">

<v-clicks>

- A team serving the rest of engineering
- OAuth identity, audit trails, RBAC
- UI for users beyond the terminal
- Anything that has to outlive the person who built it

</v-clicks>

</div>

<v-click>
<Admonition title="The platform layer" color="emerald-light">
<div class="!text-[1.7rem] !font-bold !mt-6">You're not the user. Your org is.</div>
</Admonition>
</v-click>

<!--
Here's the elephant. A lot of solo developers are skipping MCP and extending their coding agents directly. Skills, CLAUDE.md files, custom slash commands. For them, that's the right call. Fast, local, lives in the repo, no servers to maintain. But you're not in this room to optimize your personal workflow. You're here because you build platforms. Platforms have multiple users, governance to satisfy, identities to track, and product managers who won't open a terminal. Skills don't have audit trails. Skills can't authenticate as the user against external systems. Skills don't render UI for the PMs. The protocol war may shift. The need for a protocol won't.
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

---

<div class="absolute inset-0 flex flex-col justify-center items-start px-20">
  <h1 class="!text-[5.5rem] !leading-[1.02] !font-semibold !tracking-tight !mb-6 !max-w-[95%]">
    Two engineers.<br/>One side project.<br/><span class="text-[var(--frost1)]">9 months.</span>
  </h1>

  <div class="!mt-8 !text-[1.5rem] !leading-relaxed opacity-80">
    <v-clicks>
    <div><strong class="text-[var(--frost1)]">May 2025</strong>&nbsp;&nbsp;Ido (Palo Alto Networks) and Liad (Shopify)<br/>start MCP-UI as a side project</div>
    </v-clicks>
  </div>
</div>

<!--
This didn't come from a corporate lab. Two engineers started a side project. OpenAI independently validated the idea at DevDay. Anthropic and OpenAI co-authored the spec. Nine months later it shipped everywhere with 9 launch partners on day one - Amplitude, Asana, Box, Canva, Clay, Figma, Hex, monday.com, and Slack. Monday.com acqui-hired the founders.

That's how fast this moved.
-->

---
layout: default
---

<div class="absolute inset-0 bg-black flex items-center justify-center">
  <img src="/jazz-music-stops.png" class="h-full w-auto object-contain" />
</div>

<!--
~5s. No words. The plot twist: this didn't come from a corporate lab. Let the meme land, then click into "Meet the Inventors".
-->

---
layout: default
---

# Meet the Inventors


<div class="flex items-start gap-12">
<div class="flex-shrink-0 w-[40%] flex flex-col gap-3">
<img src="/ido-liad-mcp-summit.jpg" class="w-full rounded-2xl shadow-xl border-4 border-[var(--frost1)]/30" />
<div class="!text-[0.95rem] opacity-50 text-center">MCP Developers Summit, London 2025</div>
</div>
<div class="flex-1 space-y-4">
<v-click>
<div class="p-4 rounded-xl border border-solid border-[var(--frost1)]/30 bg-[var(--frost1)]/5">
<div class="!text-[1.3rem] !font-bold">Ido Salomon</div>
<div class="!text-[1.05rem] opacity-80 !mt-1">Author of MCP-UI</div>
</div>
</v-click>
<v-click>
<div class="p-4 rounded-xl border border-solid border-[var(--frost1)]/30 bg-[var(--frost1)]/5">
<div class="!text-[1.3rem] !font-bold">Liad Yosef</div>
<div class="!text-[1.05rem] opacity-80 !mt-1">Co-creator of MCP-UI</div>
</div>
</v-click>
</div>
</div>

<v-click>
<div class="absolute bottom-8 right-8 max-w-[28rem] rotate-[2deg] px-6 py-4 rounded-xl border-2 border-solid border-[#d08770] bg-[#d08770] text-[#2e3440] shadow-xl !text-[1.2rem] !leading-snug z-10">
A side project launched May 2025. Monday.com acqui-hired them both. Now they co-author the spec with Anthropic and OpenAI.
</div>
</v-click>

<!--
And here's the part we love sharing at a Tel Aviv conference. Ido was at Palo Alto Networks, Liad at Shopify. Both Israeli. They started MCP-UI as a side project in May 2025 - an SDK that lets MCP servers return interactive HTML instead of just text.

GitMCP, their other project, hit top 10 out of over 5,000 MCP servers. Monday.com - also Israeli, Nasdaq-listed - acqui-hired them both to work directly in the CEO's office. Now they co-author the MCP Apps spec with Anthropic and OpenAI on the global steering committee.

Homegrown talent, global impact. This photo is from the MCP Developers Summit in London where they presented the specification.
-->


---

<div class="absolute inset-0 flex flex-col justify-center items-start px-20">
  <div class="opacity-60 tracking-[0.3em] uppercase !text-[1.1rem] !mb-6">The full timeline</div>
  <h1 class="!text-[4.5rem] !leading-[1.02] !font-semibold !tracking-tight !mb-8 !max-w-[95%]">
    Two engineers. One side project.<br/>
    <span class="text-[var(--frost1)]">9 months.</span>
  </h1>

  <div class="!max-w-[92%] [&_div]:!text-[1.4rem] [&_div]:!leading-[1.4] space-y-4">

  <div><strong class="text-[var(--frost1)]">May 2025</strong>&nbsp;&nbsp;Ido (Palo Alto Networks) and Liad (Shopify) start MCP-UI as a side project</div>

  <v-clicks>

  <div><strong class="text-[var(--frost2)]">Oct 2025</strong>&nbsp;&nbsp;OpenAI ships Apps SDK at DevDay, validates the approach</div>

  <div><strong class="text-[var(--purple)]">Nov 2025</strong>&nbsp;&nbsp;SEP-1865 draft: Anthropic + OpenAI propose the spec together</div>

  <div><strong class="text-[var(--green)]">Jan 2026</strong>&nbsp;&nbsp;Ships in Claude, ChatGPT, VS Code, Goose.<br/><span class="opacity-80">9 day-one partners: Amplitude, Asana, Box, Canva, Clay, Figma, Hex, monday.com, Slack.</span></div>

  </v-clicks>

  </div>

  <v-click>

  <div class="!mt-8 !text-[1.25rem] !leading-relaxed opacity-80 italic !max-w-[92%]">
    Monday.com acqui-hired the founders. <strong class="not-italic">From side project to industry standard in 9 months.</strong>
  </div>

  </v-click>
</div>

<!--
This didn't come from a corporate lab. Two engineers started a side project. OpenAI independently validated the idea at DevDay. Anthropic and OpenAI co-authored the spec. Nine months later it shipped everywhere with 9 launch partners on day one - Amplitude, Asana, Box, Canva, Clay, Figma, Hex, monday.com, and Slack. Monday.com acqui-hired the founders.

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

<div class="grid grid-cols-3 gap-5">

<v-click>
<div class="p-4 rounded-xl border border-solid border-[var(--frost1)]/30 bg-[var(--frost1)]/5">
  <div class="flex items-center gap-2 !mb-3">
    <div class="w-7 h-7 rounded-full bg-[var(--frost1)] text-[#2e3440] flex items-center justify-center !font-bold !text-[0.95rem]">1</div>
    <div class="!font-semibold tracking-wide uppercase !text-[0.85rem] opacity-80">Request</div>
  </div>
  <div class="space-y-2 !text-[0.95rem] !leading-snug">
    <div><span class="opacity-50">&rarr;</span> Developer asks: <em>"Show me the catalog"</em></div>
    <div><span class="opacity-50">&rarr;</span> LLM calls tool <code>show-catalog</code></div>
    <div><span class="opacity-50">&rarr;</span> Tool returns <strong>data</strong> + pointer to <strong>UI resource</strong></div>
  </div>
</div>
</v-click>

<v-click>
<div class="p-4 rounded-xl border border-solid border-[var(--frost1)]/30 bg-[var(--frost1)]/5">
  <div class="flex items-center gap-2 !mb-3">
    <div class="w-7 h-7 rounded-full bg-[var(--frost1)] text-[#2e3440] flex items-center justify-center !font-bold !text-[0.95rem]">2</div>
    <div class="!font-semibold tracking-wide uppercase !text-[0.85rem] opacity-80">Render</div>
  </div>
  <div class="space-y-2 !text-[0.95rem] !leading-snug">
    <div><span class="opacity-50">&rarr;</span> Host fetches HTML from <code>ui://catalog/app.html</code></div>
    <div><span class="opacity-50">&rarr;</span> Renders in a <strong>sandboxed iframe</strong></div>
    <div><span class="opacity-50">&rarr;</span> Inline in the conversation</div>
  </div>
</div>
</v-click>

<v-click>
<div class="p-4 rounded-xl border border-solid border-[var(--frost1)]/30 bg-[var(--frost1)]/5">
  <div class="flex items-center gap-2 !mb-3">
    <div class="w-7 h-7 rounded-full bg-[var(--frost1)] text-[#2e3440] flex items-center justify-center !font-bold !text-[0.95rem]">3</div>
    <div class="!font-semibold tracking-wide uppercase !text-[0.85rem] opacity-80">Interact</div>
  </div>
  <div class="space-y-2 !text-[0.95rem] !leading-snug">
    <div><span class="opacity-50">&rarr;</span> Developer clicks <em>"Deploy"</em> inside the UI</div>
    <div><span class="opacity-50">&rarr;</span> UI calls an <strong>app-only tool</strong></div>
    <div><span class="opacity-50">&rarr;</span> Deployment runs, UI updates inline</div>
  </div>
</div>
</v-click>

</div>

<v-click>
<div class="grid grid-cols-3 gap-5 !mt-5">

<div class="p-3 rounded-lg border border-solid border-emerald-400/40 bg-emerald-400/5">
  <div class="!text-[0.75rem] tracking-[0.2em] uppercase opacity-70 !mb-1">Two-part registration</div>
  <div class="!text-[0.9rem] !leading-snug"><strong>Tool</strong> returns data + <code>_meta.ui.resourceUri</code>. <strong>Resource</strong> serves the bundled HTML.</div>
</div>

<div class="p-3 rounded-lg border border-solid border-sky-400/40 bg-sky-400/5">
  <div class="!text-[0.75rem] tracking-[0.2em] uppercase opacity-70 !mb-1">App-only tools</div>
  <div class="!text-[0.9rem] !leading-snug">The UI can call them. The LLM <strong>cannot see</strong> them. User stays in control.</div>
</div>

<div class="p-3 rounded-lg border border-solid border-green-400/40 bg-green-400/5">
  <div class="!text-[0.75rem] tracking-[0.2em] uppercase opacity-70 !mb-1">Zero token cost</div>
  <div class="!text-[0.9rem] !leading-snug">UI ships as a resource, not as generated tokens. Cost stays flat.</div>
</div>

</div>
</v-click>

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
~6s. Let the gif loop a couple of times. No words. The audience laughs, you give them space to actually think with you.
-->

---

<div class="absolute inset-0 flex flex-col justify-center items-center px-16 text-center">
  <h1 class="!text-[7rem] !leading-[1.05] !font-semibold !tracking-tight !m-0 !max-w-[90%]">
    The <span class="text-[var(--frost1)]">Agentic IDP</span> Stack
  </h1>
</div>

---
layout: two-cols-header
---


# What is Agentic UI?

<v-click>
<p class="!text-[1.56rem] !leading-relaxed !mt-2 !mb-4 opacity-80">
Agentic UI is the umbrella. Any interface an AI agent controls at runtime. <br></br><strong>MCP Apps is one approach inside it</strong>. 
</p>
</v-click>

::left::

<v-click>

<h3 class="!text-[1.5rem] !mt-2 !mb-3">3 components for UI population</h3>

<div class="opacity-80 [&_ul]:list-disc [&_ul]:pl-6 [&_li]:!text-[1.05rem] [&_li]:!leading-[1.5] [&_li]:!my-2">

- **Open-ended.** Agent renders custom HTML. <br></br>*(MCP Apps)*
- **Declarative.** Agent emits UI as data. *(A2UI)*
- **Alignment.** Align & sync the components with the agent in the UI. *(AG-UI / CopilotKit)*

</div>

</v-click>

::right::

<v-click>

<h3 class="!text-[1.5rem] !mt-2 !mb-3">Where MCP Apps needs help</h3>

<div class="opacity-80 [&_ul]:list-disc [&_ul]:pl-6 [&_li]:!text-[1.05rem] [&_li]:!leading-[1.5] [&_li]:!my-2">

- **Scale.** Hand-built HTML doesn't fit hundreds of platform tools.
- **Reach.** MCP hosts only. Not mobile, email, or PDF.
- **Custom frontends.** Your own dashboard isn't an MCP host.

</div>

</v-click>

<!--
Bridge before the next two slides. Two things to land. First, Agentic UI is the umbrella term. MCP Apps is one slice of it, not separate from it. CopilotKit frames the space as three patterns by who controls the UI. Open-ended is the agent rendering HTML, that's MCP Apps. Declarative is the agent emitting UI as data, that's A2UI. Controlled is you defining the components and the agent triggering them, that's AG-UI through CopilotKit. Second, MCP Apps nails what we just demoed. But it doesn't scale to hundreds of tools, it doesn't reach mobile or email or PDF, and it doesn't work in your own dashboard. The next two slides each address those gaps. They compose with MCP Apps, not replace them.
-->

---
layout: two-cols-header
---


# A2UI: the standard for declarative UI

<v-click>
<p class="!text-[1.56rem] !leading-relaxed !mt-2 !mb-4 opacity-80">
Google-backed, framework-agnostic. The agent describes the UI as <strong>data</strong>. The host renders it natively in whatever framework it already uses. v0.9 shipped in 2026 alongside Google's ADK.
</p>
</v-click>

::left::

<v-click>

<h3 class="!text-[1.5rem] !mt-2 !mb-3">How it works</h3>

<div class="opacity-80 [&_ul]:list-disc [&_ul]:pl-6 [&_li]:!text-[1.05rem] [&_li]:!leading-[1.5] [&_li]:!my-2">

- Agent emits a UI **spec** as JSON
- Host renders it with **native** components
- Same spec works on web, mobile, email, PDF
- No iframes. No HTML generation.

</div>

</v-click>

::right::

<v-click>

<h3 class="!text-[1.5rem] !mt-2 !mb-3">Why it matters for platforms</h3>

<div class="opacity-80 [&_ul]:list-disc [&_ul]:pl-6 [&_li]:!text-[1.05rem] [&_li]:!leading-[1.5] [&_li]:!my-2">

- One conversation UI, every surface your team owns
- Native rendering means accessibility, theming, perf
- Pick your component catalog once, reuse everywhere
- Designed to compose with MCP and AG-UI

</div>

</v-click>

<!--
A2UI is Google's answer to the same question MCP Apps answers, with a different bet. Where MCP Apps ships pre-built HTML, A2UI ships a UI description as data and lets the host render it natively in whatever framework it already uses. Same agent output, different host renderers. React on web, Compose on Android, SwiftUI on iOS, plain HTML in email, formatted text in PagerDuty. The killer feature for platform engineering: write your service catalog UI once, render it in your internal portal, in Claude Desktop, in a mobile pager app, in escalation emails. v0.9 shipped in 2026. It's framework-agnostic by design. Backed by Google's Agent Development Kit but the spec is open.
-->

---
layout: default
---


# CopilotKit + AG-UI: the unifier

<v-click>
<p class="!text-[1.6rem] !leading-snug !mt-2 !mb-2 opacity-80">
<strong>AG-UI</strong>: the open protocol between any agent backend and any frontend.
</p>
<p class="!text-[1.6rem] !leading-snug !mt-0 !mb-6 opacity-80">
<strong>CopilotKit</strong>: its first-party React host.
</p>
</v-click>

<v-click>

<h3 class="!text-[1.5rem] !mt-2 !mb-3">What this unlocks</h3>

<div class="opacity-85 [&_ul]:list-disc [&_ul]:pl-6 [&_li]:!text-[1.25rem] [&_li]:!leading-[1.4] [&_li]:!my-2 !max-w-[92%]">

- Streaming, tool calls, shared state, interrupts. One channel.
- Backend swappable: LangGraph, Mastra, PydanticAI, Agno, CrewAI, ADK, custom.
- Your React, your branding. MCP Apps and A2UI compose on top.
- Long-running, bidirectional. Built for what HTTP wasn't.

</div>

</v-click>

<Admonition title="The host can be yours" color="emerald-light">
Claude Desktop is one host. CopilotKit lets you build your own, and the same MCP Apps, A2UI surfaces, and AG-UI actions render inside it.
</Admonition>

<div class="absolute bottom-[14px] right-6 bg-white rounded-lg p-2">
  <QRCode value="https://docs.ag-ui.com/introduction" :size="90" render-as="svg" />
</div>

<!--
This is the practical answer to "but what about my own platform frontend?" AG-UI is the open, event-based protocol that standardizes how agent backends talk to frontends — streaming, tool calls, shared state, human-in-the-loop, all on one bidirectional channel. It was born from CopilotKit's work with LangGraph and CrewAI and is now an open protocol with multiple first-party clients. CopilotKit itself is the MIT-licensed React host: you write the developer dashboard your engineers actually want to use, embed a chat panel, and the same MCP Apps + A2UI surfaces + AG-UI streaming actions you've seen all day render inside YOUR app. Same backend code, different host. The point of the protocol is that the BACKEND is replaceable: today LangGraph, tomorrow your own agent, the frontend doesn't care. That's the bet on a standard. If your platform team needs a branded developer experience that includes conversation, this is the stack.
-->

---
layout: default
---


# When to use what

<div class="!text-[1.1rem] !leading-snug mt-2 !mb-[20px] [&_th]:!py-1.5 [&_th]:!px-2 [&_td]:!py-1.5 [&_td]:!px-2">

| | **MCP Apps** | **A2UI** | **CopilotKit + AG-UI** |
|---|---|---|---|
| **Best for** | Rich interactions in MCP hosts | Cross-surface declarative UI | Your own platform frontend |
| **UI** | Pre-built HTML bundles | Agent-emitted spec (data) | React components in your app |
| **Renders in** | Claude, ChatGPT, VS Code, Goose, Cursor | Any A2UI renderer (web/mobile/email) | Your custom dashboard |
| **Who writes UI?** | You (HTML, once per tool) | You (component catalog, agent assembles) | You (React) + MCP Apps brought in |
| **Platform use case** | Service catalog inside Claude / Cursor | Same UI in web + mobile + email | Internal developer dashboard |

</div>

<v-click>

<Admonition title="They compose" color="purple-light">
MCP Apps inside Claude. A2UI for cross-surface reach. CopilotKit + AG-UI to bring it all into your own dashboard. The 2026 platform stack uses all three.
</Admonition>

</v-click>

<!--
This is not a "pick one" decision. MCP Apps when your developers live in Claude or Cursor and you need rich interactions. A2UI when you need the same conversation UI to work in web, mobile, and email. CopilotKit and AG-UI when you're building your own internal developer portal and want the conversation baked in. They compose. A real platform team uses all three for different workflows.
-->

---
layout: two-cols-header
---


# Recap: From Destination to Delivery

<p class="!text-[1.3rem] !leading-relaxed !mt-2 !mb-5 opacity-80 !max-w-[92%] italic">
Portals are destinations. Conversations are interfaces that come to you.
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

<blockquote class="!text-[1.25rem] !leading-relaxed !pl-4 border-l-4 border-solid border-[var(--frost1)] !my-3">
"Deploy user-service to staging"
</blockquote>

<div class="p-3 rounded-xl border-2 border-solid border-[var(--green)] bg-[var(--slidev-bg-alt)] mt-3">
  <div class="text-[var(--frost1)] !text-[0.95rem] mb-1 font-semibold">Platform Service Catalog</div>
  <div class="!text-[1rem]">user-service &mdash; healthy &mdash; 3 replicas</div>
  <div class="mt-2">
    <span class="px-2 py-1 bg-[var(--frost3)] text-white !text-[0.85rem] rounded">Deploy to Staging</span>
  </div>
</div>

<Admonition title="3 steps, 0 context switches" color="emerald-light" />

</v-click>

<!--
Recap before action items. Same operation, two paradigms. Eight steps versus three. Five minutes versus ten seconds. Same platform data, same security model. The portal was a destination - you had to go to it. The conversation is delivery - the platform comes to you. That's the shift. Now here's what you do on Monday.
-->

---
layout: default
---


# What to do Monday morning

<p class="!text-[1.3rem] !leading-relaxed !mt-2 !mb-6 opacity-80 !max-w-[92%]">
Four moves your platform team can run this week.
</p>

<div class="grid grid-cols-2 gap-5">

<v-click>
<div class="px-5 py-2 rounded-xl border border-solid h-full" style="border-color: rgba(136, 192, 208, 0.5); background: rgba(136, 192, 208, 0.08);">
<div class="!text-[2rem] !font-bold !leading-none !m-0" style="color: var(--frost1);">01</div>
<div class="!text-[1.2rem] !font-bold !mt-1 !mb-2">Audit your portal</div>
<p class="!text-[1.05rem] !leading-snug !m-0 opacity-80">Which workflows have the lowest adoption? Those are your MCP candidates.</p>
</div>
</v-click>

<v-click>
<div class="px-5 py-2 rounded-xl border border-solid h-full" style="border-color: rgba(163, 190, 140, 0.5); background: rgba(163, 190, 140, 0.08);">
<div class="!text-[2rem] !font-bold !leading-none !m-0" style="color: var(--green);">02</div>
<div class="!text-[1.2rem] !font-bold !mt-1 !mb-2">Build one MCP server</div>
<p class="!text-[1.05rem] !leading-snug !m-0 opacity-80">Start with service catalog or deploy.</p>
</div>
</v-click>

<v-click>
<div class="px-5 py-2 rounded-xl border border-solid h-full" style="border-color: rgba(235, 203, 139, 0.5); background: rgba(235, 203, 139, 0.08);">
<div class="!text-[2rem] !font-bold !leading-none !m-0" style="color: var(--yellow);">03</div>
<div class="!text-[1.2rem] !font-bold !mt-1 !mb-2">Test your Agentic UI POC</div>
<p class="!text-[1.05rem] !leading-snug !m-0 opacity-80">Track tool calls, UI renders, time-to-action. Compare adoption rates.</p>
</div>
</v-click>

<v-click>
<div class="px-5 py-2 rounded-xl border border-solid h-full" style="border-color: rgba(180, 142, 173, 0.5); background: rgba(180, 142, 173, 0.08);">
<div class="!text-[2rem] !font-bold !leading-none !m-0" style="color: var(--purple);">04</div>
<div class="!text-[1.2rem] !font-bold !mt-1 !mb-2">Plan for the stack</div>
<p class="!text-[1.05rem] !leading-snug !m-0 opacity-80">MCP Apps for deep flows inside Claude, ChatGPT, or Cursor. A2UI when the same UI has to reach mobile, email, or PDF. CopilotKit + AG-UI when you want it in your own dashboard.</p>
</div>
</v-click>

</div>

<!--
Four moves for Monday. Audit the portal workflows nobody uses - those are your MCP candidates. Build one MCP server around 250 lines, our demo is that small. Measure against the portal, especially time-to-action. And plan for the stack. Remember the Backstage slide - your portal isn't dying, it's becoming the plumbing under your MCP server. Same catalog, new interface.
-->

---

<div class="absolute inset-0 flex flex-col justify-center items-center px-20 text-center">
  <h1 class="!text-[6rem] !leading-tight !font-semibold !tracking-tight !m-0 !max-w-[95%]">
    Stop Building <span class="opacity-50">Portals.</span><br/>
    Start Building <span v-mark.circle.yellow="1" class="text-[var(--frost1)]">Conversations</span>.
  </h1>
</div>

<!--
Your portal isn't dead. It's your catalog of record, your golden paths, your agent gateway. But it is no longer the primary interface. The conversation is.

Thank you.
-->

---

<div class="absolute inset-0 flex flex-col justify-center items-center px-20 text-center">
  <h1 class="!text-[12rem] !leading-none !font-semibold !tracking-tight !m-0 text-[var(--frost1)]">
    Q&amp;A
  </h1>
</div>

<!--
Open it up for questions. If there's time, we can also show specific parts of the demo again or dive deeper into any of the GenUI approaches.
-->

---
layout: default
---

<div class="absolute inset-0 flex flex-col justify-center items-center px-20">
  <div class="opacity-60 tracking-[0.3em] uppercase !text-[1rem] !mb-4">Thank you</div>
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
      <img src="/hila-fish.jpg" class="w-28 rounded-full mx-auto mb-3 border-4 border-[var(--frost1)]/30" />
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
      <div class="opacity-60 !text-[0.85rem] mt-1 !leading-snug">github.com/dirien/stop-building-<br/>portals-start-building-conversations</div>
      <div class="mt-4 bg-white rounded-lg p-2 inline-block">
        <QRCode value="https://github.com/dirien/stop-building-portals-start-building-conversations" :size="110" render-as="svg" />
      </div>
    </div>
  </div>
</div>

<!--
Thank you! Scan the QR codes to connect on LinkedIn or grab the slides and demo code from the repo.
-->

---

<!-- PARKED: IEP slide — move back into the deck when ready -->

<div class="absolute inset-0 flex flex-col justify-center items-center px-20 text-center">
  <h1 class="!text-[12rem] !leading-none !font-semibold !tracking-tight !m-0">
    I<span class="text-[var(--red)]" style="text-decoration: line-through; text-decoration-thickness: 6px;">D</span><span class="text-[var(--frost1)]">E</span>P
  </h1>
  <p class="!mt-8 !text-[2rem] !m-0 opacity-60">
    Internal <span style="text-decoration: line-through; color: var(--red);">Developer</span> <span class="text-[var(--frost1)]">Employee</span> Platform / internal developer conversations - until now we had only developers as our customers. now, we also have a new customer profile - agents
  </p>
</div>
