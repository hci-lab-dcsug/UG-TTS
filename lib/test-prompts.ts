export type TestPrompt = {
  id: string
  title: string
  text: string
}

export const TEST_PROMPTS: TestPrompt[] = [
  {
    id: "very-short",
    title: "Very short",
    text: "Ameyaw; nea ɔte Pataase no nim Opoku a ɔte Patapaakurom no.",
  },
  {
    id: "short",
    title: "Short",
    text: "Adan mmeɛnsa bi sisi beaeɛ bi. Adan no ahosuo yɛ nnodoeɛ, akokɔsradeɛ ne kɔkɔɔ. Nkuruwa bi sisi pono nnodoeɛ bi so. Nkuruwa no ahosuo yɛ bibire, ahahammono ne kɔkɔɔ.",
  },
  {
    id: "normal",
    title: "Normal",
    text: "Obiara wɔ fawohodie wɔ mmara no mu a nyiyimu biara nni mu. Ɛmfa ho ne nipa no ahosuo, ɔman a ɔfiri mu, kasa a ɔka, n'agyapadeɛɛ, bɔbea, ɔsom anaa amanyɔkuo a ɔdɔm no, yɛn nyinaa wɔ fawohodie. Bio, ɛmfa ho ne nnipa no dibere wɔ ɔman bi mu, anaa sɛ sɛdeɛ ɔman bi agye din wɔ amanyɔsɛm mu anaa amammuo mu no, obiara ntietia obi fawohodie so.",
  },
  {
    id: "long",
    title: "Long",
    text:
      "Togo a ɛwɔ Abibiman mu no ka Frɛnkye kasa. Kasa titiriw a ɛwɔ Ghana ha ne Borɔfo kasa. Nigeriafo nso ka Igbo, Yuroba, Hausa ne Fulfulde kasa. Saa ara nso na Burkinafo nso ka Bissa kasa. Wokɔ Kenyaman mu a, wɔka Swahili. Senufo kasa nso agye nhini wɔ Maliman mu yiye. Assemblies of God asafo no reyɛ akɔmkye ne odima mpaebɔ. Pusuban a ɛwɔ Ajumako Techiman yɛ anika. Maame no de aboade kɔmaa sɔfo no. Nyankomade a kɔmfo no yɛe no nyaa nsunsuansopa. Akwankyerɛ no yɛɛ adwuma. Afe yi, akuafo afoofi da a wɔdii no wɔ Ajumako no yɛɛ anika. Ghana fawohodie da a yɛrebedi no bɛyɛ dɛ ɛnam ɛho nhyehyɛe a yɛde agu apono so.Yentumi nyi bosommuru mfiri Mfatsefo abakɔsɛm mu. Somkehyire nyɛ adewa. Wiem nsakraeɛ mu nsɛm. Mfeɛ kakra a atwa mu yi, wiem ayɛ hye ɛnam nnipa dwumadie binom nti. Ɛho akohia sɛ, Abibirem Atɔeɛ aman nkabomkuo sɔre tia saa nnipa dwumadie yi. Ankorɛankorɛ dwumadie ne nnwumakuo deɛ wɔ nsunsuansoɔ bɔne wɔ wiem nsakraeɛ so. Deɛ yɛhu ne sɛ, wisie a ɛfiri mfidie a yɛde yɛ adwuma mu no sɛe wiem ne mframa a yɛhome no."
  },
  {
    id: "extremely-long",
    title: "Extremely long",
    text:
      "Mpɛn pii no, ɛyɛ a yɛfa wiase anaa beaeɛ bi nsakraeɛ sɛ wiem nsakraeɛ, nanso deɛ ɛwɔ sɛ yɛhyɛ no nso ne sɛ ɛda nso firi wiem nsakraeɛ ho, ɛsiane sɛ ɛyɛ mmerɛ tenten adeɛ, nanso wiem deɛ, ɛtumi sakra daa daa, anaa afe ntam. Beaeɛ bi nsakraeɛ no bi ne sɛ wiem reyɛ hye anaa ɛreyɛ nwunu, ne nsutɔ dodoɔ, ne mpo baabi a mframa a ɛbɔ wɔ hɔ no ani hwɛ. Beaeɛ biara wɔ sɛdeɛ ɛhɔ nsakraeɛ teɛ. Sɛ yɛhwɛ anweasase so sei a, ɛsiane nsuo a ɛntaa ntɔ wɔ hɔ no nti, yɛtumi ka sɛ saa asase no yɛ bonini.Wei kyerɛ sɛ sɛ wode aduadeɛ biara si asase yi so a, ɛntumi nnyina, kampɛsɛ ayɛ yie aso aba. Beaeɛ no bi nsakraeɛ nso wɔ hɔ a bosuo gugu, na ɛhɔ yɛ hye pa ara nso. Afei beaeɛ bi nso wɔ hɔ a sɛdeɛ ɛhɔ nsakraeɛ teɛ no nti, ɛhɔ yɛ nwunu ɔpɛ berɛ, na nsutɔ berɛ nso ɛhɔ yɛ hye kakra. Beaeɛ nsakraeɛ yɛ mmerɛ tenten adeɛ a ɛsi wɔ beaeɛ bi, na ɛnam so ma nsakraeɛ ba ewiem hyeɛ anaa ewiem nwunu ne sɛdeɛ wiem nhyehyɛeɛ teɛ ne ne nsesaeɛ wɔ saa beaeɛ no. Ɛtumi si wɔ beaeɛ pɔtee bi anaa asase no fa bi so. Ɛtumi sɛe ewiem nhyehyɛeɛ, ne saa nti obi ntumi mfa n'ani mmu anaa mmɔ ne tirim nkyerɛ sɛdeɛ ewiem nhyehyɛeɛ teɛ. Ɛsiane sɛ obi ntumi nhunu deɛ wiem nhyehyɛeɛ teɛ, anaa ntumi mfa n'ani mmu deɛ wiem nhyehyɛeɛ bɛyɛ nti, ɛma afuyɛ yɛ den wɔ mmeaeɛ a wɔyɛ mfuo, ɛfiri sɛ wɔntumi mfa wɔn ani nto nsutɔ so. Wei si ɛfiri sɛ, nsuo ntɔ wɔ ne berɛ mu, na ɛntɔ sɛdeɛ ɛsɛ sɛ ɛtɔ no nso. Saa nsakraeɛ yi ne nsuyiri, gyahyehyeɛ ne atoyerɛnkyɛm pii na ɛnam. Sɛ yɛhwɛ atifi ne anaafoɔ fam a, ewiem tumi yɛ hye, nane adeɛ a ɛtumi bɔ asase no ho ban ma ɛmu yɛ nwunu no berɛ ano berɛ ano. Wei tumi ma ɛpo yɛ ma wɔ wiase fa bi. Ɛsane nso tumi ma nsuwansuwa ne asuo akɛseɛ mu bae, na ɛnam so de nsuyiri ne susuan ba bɛsɛe nsase a ɛbemmɛn nsuo no ano no. Weinom nyinaa gyina sɛdeɛ ewiem si fa yɛ hye so. Wiase nsakraeɛ a ɛrekɔ so no nyinaa farebae yɛ nnipa dwumadie bi te sɛ wɔrehyehye nneɛma a awuduro wɔ mu ne nneɛma a ɛsɛe mframa. Saa nneɛma yi nhyehyeɛ tumi ma adubɔne bi a ɛsɛe mframa ba asase no mframa mu ne ewiem.",
  },
]
