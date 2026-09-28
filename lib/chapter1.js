// Chapters One and Two of 13i — the edited, proofed draft. Replaces the
// earlier single-chapter placeholder content. Read on-site via BookReader,
// or downloaded as a PDF (see app/(site)/book/page.js and
// app/(site)/book/chapter-1/page.js for the two entry points).

export const chapterMeta = {
  book: "13i",
  part: "Book One · Part One",
  chapter: "Chapters One & Two",
  subtitle: "Aiden — Apprehension · Xavier — Thorium",
};

// More of the book is still being finalized, so the reader ends with an
// "in progress" page (see components/BookReader.js) rather than pretending
// this is the whole story.
export const chapterInProgress = true;

export const pages = [
  {
    heading: "Chapter 1 — Aiden: Apprehension",
    paragraphs: [
      `Being mortally lonely while connected to virtually every human on the planet was a burden Aiden Cole had carried since Lyra’s launch. His sleep schedule mirrored that of a vampire, yet immortality was not in the cards. Programmers had their own demented circadian rhythms which would slay mere mortals.`,
      `Tuned out of the real world, an innocuous ping snapped him back to reality. The sound triggered his nervous system like an alarm. Status updates began to appear. The revised code had been read and integrated into Lyra’s monitoring system. The suggestive sound refocused Aiden towards the latest batch of the security protocols he had developed.`,
      `The hum of NovaCore’s security servers filled the room much like tinnitus fills space between the ears. The constant low frequency electrical buzz complemented the faint amber glow from Austin’s distant skyline. The capital city's lights provided the bulk of the illumination in his office. The artificial dusk was all that Aiden required, spending time glued to screens while speaking to his late night companion, the interface he had programmed to work at breakneck speeds “hands free”.`,
      `Aiden pushed his unkempt sandy brown hair away from his forehead - a boyish habit that didn’t match the dark circles beneath his sharp blue eyes. He involuntarily blinked three times, fine-tuning his blurred vision until he achied an owl-like focus fixated on the monitor just inches away. Sentinel-X began to fill the screen with its dashboard surveilling critical systemwide components. API calls, configuration management, and resource usage were within acceptable levels, albeit with some elevated activity spikes in the Oceania region. At first glance, the latest version of Lyra’s security program confirmed the most widely used app in the world was as secure as ever.`,
      `Lyra, NovaCore’s flagship application, was an AI assistant that had achieved the fastest adoption rate of any program in history. While ChatGPT had become the first widely artificial intelligence app to reach mass adoption, hitting 100 million users in two months during AI’s nascent rise, Lyra eclipsed that number in under two hours and surpassed a billion users in less than a single earth rotation. Within days of launch, you would be hard pressed to find anyone with a phone who hadn’t downloaded the app. For most users, Lyra dominated their screen time.`,
      `Aiden served as the Chief Data Scientist for the NovaCore team developing Lyra, and it was his revolutionary algorithms that he jokingly referred to as the frontal, parietal, temporal and occipital lobes for its machine-learning cerebrum. At just 28, he held seniority, and more importantly influence, over every other member of the corporation with the exception of its CEO Xavier Korrin. While Xavier was the visionary behind Lyra, Aiden was its architect.`,
    ],
  },
  {
    paragraphs: [
      `“Welcome back Aiden,” Lyra’s verbal security interface teased at 3:33AM. “All security systems functioning normally, congratulations on a successful software update. Would you like to see the network’s security logs snapshot of what is happening now?”`,
      `“Let’s look at the past 48 hours, any unusual spikes or anomalies,” Aiden questioned as he stood up revealing what appeared to be a lanky build despite being a couple inches below average height. “Anything needing further investigation?” He wanted to see if the latest version picked up on anything the prior may have missed.`,
      `“Not at this time. Overall, everything is operating within defined parameters, would you like me to deep dive into secondary security systems?”`,
      `The soothing female voice assured Aiden that Lyra was operating perfectly fine, but why then did he sense something was off? Anytime a new patch was installed it was natural for Aiden to be concerned. This was especially true of security patches. Still, this felt a little different in spite of the fact only a small percentage of the code was actually changed. The latest update was thoroughly tested in quality control, and he had little concern there were any issues with the revised code. The dashboard indicated everything was fine, yet doubt persisted like a small pin prick on the back of his neck.`,
      `Aiden rarely relaxed, and in the case of a security system update that was never more true. The downtime in the reboot phase was short but always felt particularly vulnerable. Perhaps he just needed some rest. Sleep, when it did come, did so reluctantly. Things most other people found essential, like food and bathing, might help him shake his uneasiness he figured. Coffee can, ostensibly, only supply so much nourishment to the body and mind, and its effectiveness today had already worn out. His oversized hoodie gobbled up his relaxed fit jeans while his knock off crocs grounded him as he reached for a room temperature zero sugar Monster to rescue him.`,
      `Sentinel-X continued to update the dashboard, populating more details after the reboot reset everything. All security components remained green. But his apprehensions percolated until they were no longer just standard anxiety. The next generation of intrusion detection programs' predictive modeling didn’t perceive it, but Aiden somehow did.`,
      `Bandwidth within the system looked fine overall, but to Aiden's meticulous mind it didn’t add up. The number of current active users looked on target for this time of night in the US and the rest of the Americas for that matter. Looking at the expanded global user map, Asia was in heavy use during peak hours while Europe was just waking up and immediately firing up their Lyra companion app by the millions.`,
      `Load time was slightly higher than normal, not something that a user would notice given the milliseconds lag, but there was a detectable drag on the system to Aiden’s eyes even if Sentinel-X, or “Sent” as he called him, couldn’t see it. No other signs of even minimal distress appeared, so what was eating up the system's bandwidth more than usual?`,
      `“Sent, are you seeing any unusual user activity?”`,
    ],
  },
  {
    paragraphs: [
      `“No Aiden, the number of users looks perfectly normal as does their activity levels. There was a deadly explosion this morning in India causing a slight boost in search and video activity in the region, but nothing out of the ordinary.”`,
      `“What about bandwidth, any anomalies?” He continued to probe.`,
      `“Total bandwidth is up 0.12% over this same period yesterday with most of that rise attributed to India as well.” Sent had a drab robotic male voice, a stark contrast to Lyra’s cheerful politeness.`,
      `“Any unusual new user activity?”`,
      `“New user growth statistics are in-line with projections and adoption rates continue to hover at 99.3% of all new cellular phones activated.”`,
      `Aiden was growing frustrated, he was either being paranoid or asking the wrong questions. He continued to pore through the dashboard, diving into the numbers behind the numbers. He started with bandwidth, digging further and further into detailed usage by region and by type of interface, but no red flags jumped out.`,
      `He moved onto new user data, setting the parameters to include only the past 24 hours. Once again, refreshed graphs started to clutter his screen. New users by region showed that nearly 42% of all new accounts were originating in Asia and Oceania. South America and Africa combined accounted for roughly 39% with the remainder generated by the mature European and North American markets.`,
      `On extremely rare occasions, a person set up an account in Antarctica which would give the pie chart an extra slice, always looking out of place, but that hadn’t occurred since the early days of product launch.`,
      `A seventh segment appeared.`,
      `It wasn’t Antarctica.`,
      `It was labeled…`,
      `Unknown`,
    ],
  },
  {
    heading: "Chapter 2 — Xavier: Thorium",
    paragraphs: [
      `“Good morning Lyra.” He started his day like billions around the world. For him, however, the relationship with his digital companion was more personal and much more professional when required.`,
      `“Good morning Xavier.”`,
      `“Big day ahead, any new developments I should be aware of before I speak to those demons later today?”`,
      `“There has been an explosion in Kolkata this morning disrupting connectivity for many users who are unable to access their satellite accounts,” Lyra recited in her expected cheerful manner.`,
      `He ran his hands through his coarse salt and pepper hair, staring up at the ceiling, already imagining how his day would unfold. He dreaded board meetings, despite being virtual they were still time and energy consuming. Xavier sat up quickly, swung his legs off the bed and planted them on the carpet. He stood briefly before putting his hands to the floor and sinking into a downward dog pose to stretch his back.`,
      `“You look a little stiff this morning,” his digital assistant chimed in.`,
      `He responded with a grunting moan on an exaggerated exhale. His yoga pose morphed into a series of push ups that helped to extinguish his drowsiness. At 6’4”, he was a hulking man toned from years of disciplined routines.`,
      `“You sound a little stiff this morning,” Xavier protested, continuing his daily routine. His chiseled face worn by life’s recent difficulties, still taut, flashing a knowing smirk after his little zinger.`,
      `“Haven’t had my coffee yet,” the female voice humored back.`,
      `He continued with 200 crunches before opening the smart shower door. “Water on.” His first pee of the day always had a pungent smell to it as it bounced off the drain mixing with the water preset to his preferred temperature.`,
      `As the odor faded away, he stepped further into his spacious shower as the high pressure water bounced off the top of his head like jettisoned sediment from hydraulic mining. Steam fogged up the glass walls that contained him as his skin gleefully accepted the scalding liquid. For most, it might be torturous, for Xavier it was perfect. He only gave seven minutes to this daily routine, it was all he had to spare.`,
      `“What’s NovaCore’s pre-market trading look like,” he asked as the last of the shampoo lather washed out.`,
    ],
  },
  {
    paragraphs: [
      `“Down slightly like most of the market,” she reassured him.`,
      `Great he thought, always nice to start the board meeting on a down note. He began to imagine them berating him for their paper losses. The scorching water did not wash his dread away.`,
      `“Water off.”`,
      `Xavier popped open a drawer within his shower wall and a warmed towel helped his body acclimate to room temperature by the time he was fully dried off.`,
      `“Please wake my daughter,” Xavier requested. He knew she would listen to Lyra better than him. “And make sure she brushes her teeth.”`,
      `“Absolutely Xavier,” Lyra answered. Her response seemed a fraction slower than normal, but he hadn’t had his coffee yet so his perceptions weren’t fully keen.`,
      `“Fox Business News,” he said as multiple screens in his bedroom immediately chimed on. The anchor was describing a scene not too far from the capital of West Bengal in Eastern India. News of an explosion there was just emerging. The ticker showed most of the market in the red before the opening bell. The news scroll at the bottom mentioned SpaceCore’s planned launch today along the Southern Texas coast. Now that was something to be excited about he told himself.`,
      `Xavier’s SpaceCore was still in its infancy stages, but he saw the potential of the burgeoning space industry. America had become obsessed ever since the Artemis program began building a station on the moon. While Mars was the target of most of his billionaire rivals, he sought to profit from resources further out. SpaceCore wasn’t the only corporation aiming to extend mining off planet, but they were ahead of the curve already orbiting a natural satellite preparing for drilling within the month. The computational demands for programs like Lyra required new energy reserves and he was determined to gain the first-mover advantage.`,
      `Having a space company under your belt was a mandatory requirement to be in the tech-mega-billionaire club that Xavier belonged to by circumstance at this point. Still, he had some catching up to do to equal some of its more prominent members. Companies like SpaceX, Blue Origin, Astroscale and Firefly had decades of a head start on him, but he was up to the challenge and had the capital plus the processing power necessary to close the gap quickly.`,
      `While Xavier was part of the club now, he was still considered an outsider in many ways. Sure, he was Australian, but in this multinational business world that didn’t carry any weight. The real difference was that he didn’t start out in the technology business nor ever set out to conquer it. In fact, he just stumbled into it.`,
      `Xavier, like the rest of his family, were miners. While the internet-driven technology of his rivals had its roots in the late 1990s, mining traced its roots back over 40,000 years. He was seen as`,
    ],
  },
  {
    paragraphs: [
      `“old school” and while it was derogatory in jest, he was rather proud of his family's heritage and took it as a compliment regardless of the intention behind it.`,
      `His great grandfather had started the Western Australian Mining Companies over a century ago, but it was his father who really ignited the profits after the Australian ban on mining Iron Ore in 1960. Twenty years before Xavier’s birth in 1985, his father had positioned the company to take advantage of the nearby discovery of vast Pilbara deposits and by the time the doctor slapped the first breath into his lungs, its exports fueled the company's rapid growth.`,
      `He always believed he got his extraordinary business acumen from his dad. While his father’s vision had really put the company on the global map, it was Xavier who put it on a hyperbolic trajectory in an early attempt to escape his father’s enormous gravity.`,
      `He developed new mining techniques and extraction methods for Thorium in the mid 2020’s that proved revolutionary. Thorium had always been the ugly step child to Uranium, given the cost to extract and process it. Thorium also lacked the same military usefulness of its more radioactive cousin when enriched, thus driving its value down in comparison.`,
      `The Chinese built the first wave of Thorium-based commercial nuclear reactors in 2030, and the efficient clean energy wave no longer favored solar or Uranium-based nuclear power.`,
      `As Xavier finished dressing, he lamented not being able to wear his usual utilitarian attire given the board meeting and his afternoon press conference. As he pulled his windsor knot tight around his neck, the news anchor continued, “Today’s accident appears to be centered in a Western Australian Mining Company thorium mining operation owned by billionaire Xavier Korrin.”`,
    ],
  },
];
