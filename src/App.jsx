import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'

const LEVELS_COUNT = 20
const CHALLENGES_PER_LEVEL = 10

const BADGES = [
  { id: 'recruit', name: 'Recrut 🕵️', minLevel: 1 },
  { id: 'apprentice', name: 'Ucenic 📜', minLevel: 3 },
  { id: 'specialist', name: 'Specialist 🔍', minLevel: 5 },
  { id: 'decoder', name: 'Decodor 🔓', minLevel: 7 },
  { id: 'tactician', name: 'Tactician 🧠', minLevel: 9 },
  { id: 'operative', name: 'Operativ 🎖️', minLevel: 12 },
  { id: 'elite', name: 'Agent Elită 👑', minLevel: 15 },
  { id: 'legend', name: 'Legendă 🏆', minLevel: 20 }
]

const generateGameData = () => [
  { id: 1, title: 'Ghicitori', challenges: [
    { q: 'Ce are mâini dar nu poate aplauza?', a: 'ceas', h: 'Mssoară timpul' },
    { q: 'Ce se urcă mereu dar nu coboară niciodată? (un singur cuvânt)', a: 'varsta', h: 'Trece cu fiecare zi' },
    { q: 'Am dinți dar nu mușc. Ce sunt?', a: 'pieptene', h: 'Se folosește la păr' },
    { q: 'Am un gât dar nu am cap. Ce sunt?', a: 'sticla', h: 'Conține lichide' },
    { q: 'Ce poți prinde dar nu poți arunca?', a: 'raceala', h: 'Vine iarna' },
    { q: 'Ce merge fără picioare?', a: 'timp', h: 'Mereu înainte' },
    { q: 'Ce intră în apă dar nu se udă?', a: 'umbra', h: 'Mereu după tine' },
    { q: 'Sunt plin ziua și gol noaptea. Ce sunt?', a: 'pantof', h: 'Îl porți la picior' },
    { q: 'Zbor fără aripi, plâng fără ochi. Ce sunt?', a: 'nori', h: 'Pe cer' },
    { q: 'Cu cât mă tai, cu atât cresc. Ce sunt?', a: 'groapa', h: 'Se sapă în pământ' }
  ]},
  { id: 2, title: 'Natură și Animale', challenges: [
    { q: 'Ce animal doarme în picioare?', a: 'cal', h: 'Are coamă' },
    { q: 'Câte picioare are un păianjen?', a: '8', h: 'Nu e insectă' },
    { q: 'Care este cel mai mare mamifer?', a: 'balena', h: 'Trăiește în ocean' },
    { q: 'Ce pasăre nu poate zbura și trăiește în Antarctica?', a: 'pinguin', h: 'Negru și alb' },
    { q: 'Ce animal își schimbă culoarea pielii?', a: 'cameleon', h: 'Șopârlă specială' },
    { q: 'Câte inimi are o caracatiță?', a: '3', h: 'Număr surprinzător' },
    { q: 'Ce insectă produce miere?', a: 'albina', h: 'Trăiește în stup' },
    { q: 'Care este cel mai înalt animal?', a: 'girafa', h: 'Gât lung' },
    { q: 'Ce animal trăiește cel mai mult?', a: 'testoasa', h: 'Sute de ani' },
    { q: 'Ce animal este simbolul Australiei?', a: 'cangur', h: 'Are marsupiu' }
  ]},
  { id: 3, title: 'Geografie', challenges: [
    { q: 'Care este cel mai mare ocean?', a: 'pacific', h: 'Cel mai întins' },
    { q: 'Care este cel mai mic stat din lume?', a: 'vatican', h: 'În Roma' },
    { q: 'Pe ce continent este Sahara?', a: 'africa', h: 'Cel mai mare deșert' },
    { q: 'Capitala Japoniei?', a: 'tokyo', h: 'Cel mai mare oraș din lume' },
    { q: 'Capitala Franței?', a: 'paris', h: 'Turnul Eiffel' },
    { q: 'Capitala Italiei?', a: 'roma', h: 'Colosseum' },
    { q: 'Care este cel mai lung râu din lume?', a: 'nil', h: 'În Africa' },
    { q: 'Care este cel mai adânc lac din lume?', a: 'baikal', h: 'În Rusia' },
    { q: 'Care este cea mai mare țară din lume?', a: 'rusia', h: 'Se întinde pe 2 continente' },
    { q: 'Capitala României?', a: 'bucuresti', h: 'Micul Paris' }
  ]},
  { id: 4, title: 'Știință', challenges: [
    { q: 'Ce este H2O?', a: 'apa', h: '2 hidrogen, 1 oxigen' },
    { q: 'Câte planete are sistemul solar?', a: '8', h: 'Pluton nu mai e planetă' },
    { q: 'Ce planetă este cea mai aproape de Soare?', a: 'mercur', h: 'Prima în ordine' },
    { q: 'Ce mineral este cel mai dur din lume?', a: 'diamant', h: 'Prețios și dur' },
    { q: 'Ce a inventat Edison?', a: 'becul', h: 'Lumina electrică' },
    { q: 'Ce organ curăță sângele?', a: 'rinichi', h: 'Doi în corp' },
    { q: 'Ce planet are inele?', a: 'saturn', h: 'Inele spectaculoase' },
    { q: 'Câte luni are Pământul?', a: '1', h: 'Satelit natural' },
    { q: 'Ce gaz respirăm cel mai mult?', a: 'azot', h: '78% din aer' },
    { q: 'Ce face fotosinteza?', a: 'frunza', h: 'Verde și pe rami' }
  ]},
  { id: 5, title: 'Istorie', challenges: [
    { q: 'Cine a pictat Mona Lisa?', a: 'da vinci', h: 'Geniu renascentist' },
    { q: 'În ce an a căzut Zidul Berlinului?', a: '1989', h: 'Același cu Revoluția română' },
    { q: 'Cine a descoperit America?', a: 'columb', h: 'Navigator genovezan' },
    { q: 'Ce civilizație a construit piramidele?', a: 'egipt', h: 'Faraoni și mumii' },
    { q: 'Cine a inventat tiparul?', a: 'gutenberg', h: 'Johann Gutenberg' },
    { q: 'În ce an a început Primul Război Mondial?', a: '1914', h: 'Asasinarea arhiducelui' },
    { q: 'Cine a scris Romeo și Julieta?', a: 'shakespeare', h: 'Dramaturg englez' },
    { q: 'Ce a descoperit Newton?', a: 'gravitatia', h: 'Mărul legendar' },
    { q: 'Primul om pe Lună?', a: 'armstrong', h: 'Neil Armstrong' },
    { q: 'Cine a fost primul președinte al SUA?', a: 'washington', h: 'George Washington' }
  ]},
  { id: 6, title: 'Limbaj și Cultură', challenges: [
    { q: 'Ce limbă vorbesc în Brazilia?', a: 'portugheza', h: 'Nu spaniola!' },
    { q: 'Ce limbă este cea mai vorbită în lume?', a: 'chineza', h: 'Mandarin' },
    { q: 'Sinonimul lui "frumos"?', a: 'superb', h: 'Sau minunat, feeric...' },
    { q: 'Antonimul lui "luminos"?', a: 'intunecat', h: 'Opusul luminii' },
    { q: 'Ce parte de vorbire descrie un substantiv?', a: 'adjectiv', h: 'Ex: mare, frumos' },
    { q: 'RADAR se citește la fel invers? (da/nu)', a: 'da', h: 'Palindrom' },
    { q: 'Câte litere are alfabetul englez?', a: '26', h: 'De la A la Z' },
    { q: 'Câte vocale are cuvântul COMPUTER?', a: '3', h: 'O, U, E' },
    { q: 'Ce limbă se scrie de la dreapta la stânga?', a: 'araba', h: 'Sau ebraica, persana' },
    { q: 'Câte litere are alfabetul român?', a: '31', h: 'Include ă, â, î, ș, ț' }
  ]},
  { id: 7, title: 'Film și Cultură Pop', challenges: [
    { q: 'Cine joacă Iron Man?', a: 'downey', h: 'Robert Downey Jr.' },
    { q: 'Ce film e despre un regat de gheată cu Elsa?', a: 'frozen', h: 'Let it go!' },
    { q: 'Harry Potter studiează la ce școală?', a: 'hogwarts', h: 'Școală de vrăjitori' },
    { q: 'Câți pitici sunt în Albă ca Zăpada?', a: '7', h: 'Bine, Grumpy, Timid...' },
    { q: 'Ce culoare are Hulk?', a: 'verde', h: 'Bruce Banner' },
    { q: 'Tatăl lui Luke Skywalker este?', a: 'vader', h: 'Darth Vader' },
    { q: 'Ce simbol are Batman pe costum?', a: 'liliac', h: 'Gotham City' },
    { q: 'Cine a scris Harry Potter?', a: 'rowling', h: 'J.K. Rowling' },
    { q: 'Ce personaj vrea să fie Rege al Piraților în One Piece?', a: 'luffy', h: 'Monkey D. Luffy' },
    { q: 'Care e cel mai lung film din seria Marvel?', a: 'endgame', h: 'Avengers: Endgame' }
  ]},
  { id: 8, title: 'Mâncare și Bucătărie', challenges: [
    { q: 'Din ce se face ciocolata?', a: 'cacao', h: 'Boabă tropicală' },
    { q: 'Ce fast food are arcul galben?', a: 'mcdonalds', h: 'Big Mac' },
    { q: 'Pizza este originară din?', a: 'italia', h: 'Napoli' },
    { q: 'Ce fruct are coajă galbenă și e acru?', a: 'lamaie', h: 'Citrus' },
    { q: 'Sushi este preparat tradițional din?', a: 'japonia', h: 'Orez și pește' },
    { q: 'Ce condiment galben e folosit în curry?', a: 'curcuma', h: 'Turmeric' },
    { q: 'Din ce se face pâinea?', a: 'faina', h: 'Din grâu' },
    { q: 'Ce animal dă lapte la fermă?', a: 'vaca', h: 'Moo!' },
    { q: 'Cafeaua provine din ce boabe?', a: 'cafea', h: 'Cafea arabica' },
    { q: 'Brânza se face din?', a: 'lapte', h: 'Fermentat' }
  ]},
  { id: 9, title: 'Sport', challenges: [
    { q: 'Câți jucători are o echipă de fotbal?', a: '11', h: 'Pe teren' },
    { q: 'Ce sport se joacă la Wimbledon?', a: 'tenis', h: 'Pe iarbă' },
    { q: 'La câți ani se ține Olimpiada?', a: '4', h: 'Tradițional' },
    { q: 'Câte seturi câștigă un meci de tenis (din 5)?', a: '3', h: 'Best of 5' },
    { q: 'Ce sport joacă Michael Jordan?', a: 'baschet', h: 'NBA' },
    { q: 'Câți jucători are o echipă de volei?', a: '6', h: 'Pe teren' },
    { q: 'Ce sport asociezi cu Muhammad Ali?', a: 'box', h: 'Cel mai mare' },
    { q: 'Unde s-au ținut Olimpiadele din 2024?', a: 'paris', h: 'Franța' },
    { q: 'Câte puncte valorează un touchdown în fotbal american?', a: '6', h: 'NFL' },
    { q: 'Ce sport joacă Novak Djokovic?', a: 'tenis', h: 'Sârbul numărul 1' }
  ]},
  { id: 10, title: 'Logică Fără Matematică', challenges: [
    { q: 'Ce poți vedea cu ochii închiși?', a: 'vise', h: 'Noaptea' },
    { q: 'Ce e rupt de îndată ce e rostit?', a: 'tacerea', h: 'Liniștea' },
    { q: 'Ce e mereu în fața ta dar nu se poate vedea?', a: 'viitorul', h: 'Nu e trecut' },
    { q: 'Ce se umple și se golește dar nu e un pahar?', a: 'plamani', h: 'Respirăm' },
    { q: 'Ce are dinti dar nu musca si e mai moale decat un pieptene?', a: 'fermoar', h: 'Îl ai pe haină' },
    { q: 'Ce animal dă lapte și face muu dar nu e vacă?', a: 'capra', h: 'Patruped cu coarne' },
    { q: 'Ce e rece vara și cald iarna?', a: 'blanket', h: 'Pătură' },
    { q: 'Ce poți da fără să o ai?', a: 'sfat', h: 'Recomandare' },
    { q: 'Cel mai rapid vehicul pe apă?', a: 'jetski', h: 'Scuter de apă' },
    { q: 'Ce are un om în cap dar nu se vede?', a: 'ganduri', h: 'Minte activa' }
  ]},
  { id: 11, title: 'Corpul Uman', challenges: [
    { q: 'Ce organ pompează sângele?', a: 'inima', h: 'Bate continuu' },
    { q: 'Câte oase are corpul uman adult?', a: '206', h: 'Scheletul complet' },
    { q: 'Ce organ filtrează sângele?', a: 'rinichi', h: 'Doi în corp' },
    { q: 'Ce e cel mai dur lucru din corpul uman?', a: 'smalt', h: 'La dinți' },
    { q: 'Ce organ produce bila?', a: 'ficat', h: 'Cel mai mare organ intern' },
    { q: 'Câte camere are inima?', a: '4', h: '2 auricule + 2 ventricule' },
    { q: 'Ce simț controlează urechea internă?', a: 'echilibru', h: 'Nu auzul!' },
    { q: 'Ce parte a ochiului controlează cantitatea de lumină?', a: 'iris', h: 'Colorată' },
    { q: 'Ce e cel mai lung nerv din corp?', a: 'sciatic', h: 'Nervul sciatic' },
    { q: 'Ce vitamina produce pielea prin solar?', a: 'd', h: 'Vitamina D' }
  ]},
  { id: 12, title: 'Tehnologie', challenges: [
    { q: 'Ce înseamnă WWW?', a: 'world wide web', h: 'Rețeaua globală' },
    { q: 'Cine a fondat Apple?', a: 'jobs', h: 'Steve Jobs' },
    { q: 'Ce sistem de operare face Google?', a: 'android', h: 'Pe telefoane' },
    { q: 'Ce limbaj folosesc paginile web?', a: 'html', h: 'HyperText Markup Language' },
    { q: 'Cine a inventat telefonul?', a: 'bell', h: 'Alexander Graham Bell' },
    { q: 'Ce companie face iPhone?', a: 'apple', h: 'Mårul mușcat' },
    { q: 'Ce înseamnă GPS?', a: 'global positioning system', h: 'Sistem de localizare' },
    { q: 'Ce companie face Windows?', a: 'microsoft', h: 'Bill Gates' },
    { q: 'Ce e un bug în programare?', a: 'eroare', h: 'Defect în cod' },
    { q: 'Ce înseamnă CPU?', a: 'procesor', h: 'Central Processing Unit' }
  ]},
  { id: 13, title: 'Muzică', challenges: [
    { q: 'Cine a cântat "Thriller"?', a: 'jackson', h: 'Michael Jackson' },
    { q: 'Câte note muzicale există?', a: '7', h: 'Do, Re, Mi, Fa, Sol, La, Si' },
    { q: 'Ce instrument are 88 de clape?', a: 'pian', h: 'Instrument cu clape' },
    { q: 'Cine a compus Simfonia a 9-a?', a: 'beethoven', h: 'Era surd' },
    { q: 'Câți membri are trupa Beatles?', a: '4', h: 'John, Paul, George, Ringo' },
    { q: 'Ce instrument folosește Sherlock Holmes?', a: 'vioara', h: 'Cu arc' },
    { q: 'Cine a cântat "Bohemian Rhapsody"?', a: 'queen', h: 'Freddie Mercury' },
    { q: '"We Will Rock You" e cântată de?', a: 'queen', h: 'Stomping și clapping' },
    { q: 'Ce instrument are 6 corzi?', a: 'chitara', h: 'Rock and roll' },
    { q: 'Ce înseamnă "forte" în muzică?', a: 'tare', h: 'Opus lui piano' }
  ]},
  { id: 14, title: 'Animale Sălbatice', challenges: [
    { q: 'Ce animal este cel mai rapid pe uscat?', a: 'ghepard', h: 'Până la 120km/h' },
    { q: 'Ce animal doarme 22 de ore pe zi?', a: 'koala', h: 'Mănâncă eucalipt' },
    { q: 'Ce animal poate supraviețui fără cap câteva săptămâni?', a: 'gandac', h: 'Insectă rezistentă' },
    { q: 'Ce animal are cel mai bun miros?', a: 'urs', h: 'Detectează 30km departe' },
    { q: 'Ce pasăre are vedere 360 de grade?', a: 'bufnita', h: 'Noaptea' },
    { q: 'Ce animal are amprentele identice cu ale omului?', a: 'koala', h: 'Surprinzător!' },
    { q: 'Ce animal nu bea niciodată apă?', a: 'koala', h: 'Din frunze de eucalipt' },
    { q: 'Ce mamifer poate zbura?', a: 'liliac', h: 'Batman!' },
    { q: 'Ce animal e cel mai otrăvitor din lume?', a: 'broscuta', h: 'Broscuța otravă săgeată' },
    { q: 'Câți ochi are un păianjen tipic?', a: '8', h: 'Opt ochi' }
  ]},
  { id: 15, title: 'Univers și Spațiu', challenges: [
    { q: 'Ce planetă este cea mai mare din sistem solar?', a: 'jupiter', h: 'Gigant de gaz' },
    { q: 'Cât durează lumina de la Soare la Pământ?', a: '8', h: '8 minute aproximativ' },
    { q: 'Ce e o stea căzătoare de fapt?', a: 'meteorit', h: 'Nu e stea' },
    { q: 'Pe ce planetă e Olympus Mons, cel mai înalt vulcan?', a: 'marte', h: 'Planeta roșie' },
    { q: 'Câte stele are Calea Lactee (în miliarde)?', a: '200', h: '200-400 miliarde estimativ' },
    { q: 'Ce e un an-lumină?', a: 'distanta', h: 'Nu timp, ci distanță!' },
    { q: 'Prima misiune Apollo care a ajuns pe Lună?', a: 'apollo 11', h: 'Neil Armstrong, 1969' },
    { q: 'Ce e o gaură neagră?', a: 'singularitate', h: 'Gravitație infinită' },
    { q: 'Ce planeta are ziua cea mai lungă?', a: 'venus', h: '243 zile pământene' },
    { q: 'Ce instrument a văzut mai departe în spațiu?', a: 'hubble', h: 'Telescopul Hubble' }
  ]},
  { id: 16, title: 'Mitologie', challenges: [
    { q: 'Cine era Zeus la greci?', a: 'rege', h: 'Regele zeilor' },
    { q: 'Ce era Pegasus?', a: 'cal', h: 'Cal cu aripi' },
    { q: 'Cine e ecvivalentul roman al lui Zeus?', a: 'jupiter', h: 'Planeta îi poartă numele' },
    { q: 'Ce a lui Ahile era vulnerabilă?', a: 'calcaiul', h: 'Călcâiul lui Ahile' },
    { q: 'Cine a ucis Minotaurul?', a: 'tezeu', h: 'Tezeu și labirintul' },
    { q: 'Ce simbolul are Poseidon?', a: 'trident', h: 'Zeul mărilor' },
    { q: 'Cine îi ducea pe morți în lumea lui Hades?', a: 'caron', h: 'Cu barca pe Styx' },
    { q: 'Ce era Hercule?', a: 'semizeu', h: 'Fiul lui Zeus' },
    { q: 'Din ce material sunt săgețile lui Cupidon?', a: 'aur', h: 'Îndrăgostesc' },
    { q: 'Ce a construit Dedal în mitologie?', a: 'labirint', h: 'Și aripile de ceară' }
  ]},
  { id: 17, title: 'Cultură Generală', challenges: [
    { q: 'Câte culori are curcubeul?', a: '7', h: 'ROGVAIV' },
    { q: 'Ce culoare obții din roșu + albastru?', a: 'violet', h: 'Culoare secundară' },
    { q: 'Ce limbă vorbesc în Egipt?', a: 'araba', h: 'Arabă modernă' },
    { q: 'Câte simțuri are omul în mod tradițional?', a: '5', h: 'Văz, auz, miros, gust, pipăit' },
    { q: 'Ce e cel mai scurt timp posibil de măsurat?', a: 'planck', h: 'Timp Planck' },
    { q: 'Care e cea mai vândută carte din lume?', a: 'biblia', h: 'Carte sfântă' },
    { q: 'Ce monedă folosesc în Marea Britanie?', a: 'lira', h: 'Nu euro' },
    { q: 'Cine a construit Colosseumul?', a: 'romani', h: 'Imperiul Roman' },
    { q: 'Ce capital e cel mai nordic din lume?', a: 'reykjavik', h: 'Islanda' },
    { q: 'Ce monument e în mijlocul Parisului?', a: 'turnul eiffel', h: '300 metri înalt' }
  ]},
  { id: 18, title: 'Ghicitori Avansate', challenges: [
    { q: 'Ce e mai ușor: un kg de fier sau un kg de pene?', a: 'egal', h: 'Ambele = 1kg' },
    { q: 'Dacă arunci o minge, ce face prima?', a: 'cade', h: 'Gravitația' },
    { q: 'Ce poate călători în jurul lumii fără să se miște?', a: 'stamp', h: 'Timbru poștal' },
    { q: 'Cu cât ești mai departe de mine, cu atât ești mai aproape de ce?', a: 'orizont', h: 'Nu se poate ajunge' },
    { q: 'Ce fac tot timpul dar nu obosesc?', a: 'respir', h: 'Automat' },
    { q: 'Ce are multe întrebări dar niciun răspuns?', a: 'examen', h: 'La școală' },
    { q: 'Ce e cu atât mai greu cu cât e mai gol?', a: 'balon', h: 'Cu aer e ușor' },
    { q: 'Ce face apa când îngheață?', a: 'se dilata', h: 'Crește în volum' },
    { q: 'Ce e mereu în mișcare dar nu se poate atinge?', a: 'flacara', h: 'Foc' },
    { q: 'Ce are voce dar nu are gură?', a: 'ecou', h: 'Munte, peșteră' }
  ]},
  { id: 19, title: 'România', challenges: [
    { q: 'Cel mai lung râu din România?', a: 'dunarea', h: 'Traversează mai multe țări' },
    { q: 'Ce munți sunt în centrul României?', a: 'carpati', h: 'Munții Carpați' },
    { q: 'Ce delta celebră e în România?', a: 'dunarii', h: 'Delta Dunării - UNESCO' },
    { q: 'Cine a unit Principatele Române?', a: 'cuza', h: 'Alexandru Ioan Cuza' },
    { q: 'Ce limbă vorbesc românii?', a: 'romana', h: 'Limbă latină' },
    { q: 'Cel mai înalt vârf din România?', a: 'moldoveanu', h: 'În Carpați' },
    { q: 'Ce culori are steagul României?', a: 'albastru galben rosu', h: 'Tricolor' },
    { q: 'Cine era Vlad Țepeș?', a: 'domn', h: 'Domnitor al Munteniei' },
    { q: 'In ce an s-a facut Romania Mare?', a: '1918', h: 'Marea Unire' },
    { q: 'Ce mare este lângă România?', a: 'neagra', h: 'Marea Neagră' }
  ]},
  { id: 20, title: 'Misiunea FINALĂ 🏆', challenges: [
    { q: 'Ce e cel mai mare deșert din lume (inclusiv rece)?', a: 'antarctica', h: 'Nu Sahara!' },
    { q: 'Câte oase are un rechin?', a: '0', h: 'Cartilaje, nu oase' },
    { q: 'Ce animal are cel mai mare creier?', a: 'balena albastra', h: 'Mamifer uriaș' },
    { q: 'Ce monument e pe 7 mări?', a: 'statuia libertatii', h: 'New York' },
    { q: 'Ce e mai vechi: Marele Zid Chinezesc sau Colosseumul?', a: 'zidul chinezesc', h: '700 î.Hr. vs 70 d.Hr.' },
    { q: 'Ce limbă are cele mai multe cuvinte?', a: 'engleza', h: 'Peste 1 milion' },
    { q: 'Ce continent nu are țări?', a: 'antarctica', h: 'Doar baze de cercetare' },
    { q: 'Ce se aprinde fara chibrit si nu are foc?', a: 'soare', h: 'Steaua noastră' },
    { q: 'Ce organ uman se regenerează complet?', a: 'ficat', h: 'Se poate regenera' },
    { q: 'Ai terminat! Codul secret al agenților este?', a: 'escape', h: 'Prima lecție din misiune' }
  ]}
]

const gameData = generateGameData()

function App() {
  const [screen, setScreen] = useState('accounts') // 'accounts' | 'map' | 'puzzle' | 'victory'
  const [accounts, setAccounts] = useState([])
  const [activeAccount, setActiveAccount] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0)
  const [currentChallengeIdx, setCurrentChallengeIdx] = useState(0)
  const [puzzleInput, setPuzzleInput] = useState('')
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(720)
  const [showAnswer, setShowAnswer] = useState(false)

  // Sincronizare Conturi din Supabase
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const { data, error } = await supabase.from('agents').select('*').order('score', { ascending: false })
        if (error) {
          console.error("Supabase Eroare:", error.message)
          setAccounts(JSON.parse(localStorage.getItem('escape_accounts') || '[]'))
        } else if (data) {
          setAccounts(data)
        }
      } catch (err) {
        setAccounts(JSON.parse(localStorage.getItem('escape_accounts') || '[]'))
      } finally {
        setIsLoading(false)
      }
    }
    fetchAccounts()
  }, [])

  const [roomCode, setRoomCode] = useState('')
  const [activeRoom, setActiveRoom] = useState(null)
  const [notifications, setNotifications] = useState([])

  // Sincronizare Supabase pentru Multiplayer
  useEffect(() => {
    if (!activeRoom) return

    const channel = supabase
      .channel(`room-${activeRoom}`)
      .on('broadcast', { event: 'progress_update' }, ({ payload }) => {
        addNotification(`${payload.userName} a rezolvat L${payload.level} C${payload.challenge}!`)
        // Actualizăm progresul echipei dacă este cazul (colaborativ)
      })
      .subscribe()

    return () => { channel.unsubscribe() }
  }, [activeRoom])

  const addNotification = (msg) => {
    setNotifications(prev => [...prev.slice(-4), { id: Date.now(), msg }])
  }

  const broadcastProgress = (userName, level, challenge) => {
    if (!activeRoom) return
    supabase.channel(`room-${activeRoom}`).send({
      type: 'broadcast',
      event: 'progress_update',
      payload: { userName, level, challenge }
    })
  }

  useEffect(() => {
    if (accounts.length > 0) {
      localStorage.setItem('escape_accounts', JSON.stringify(accounts))
    }
  }, [accounts])

  // Timer logic
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const createAccount = async (name) => {
    if (!name) return
    const newId = Date.now()
    const newAcc = { 
      name, 
      id: newId, 
      unlockedLevel: 1, 
      unlockedChallenge: 1, 
      score: 0, 
      badges: [] 
    }

    try {
      const { data, error } = await supabase.from('agents').insert([newAcc]).select()
      if (error) {
        setAccounts([...accounts, newAcc])
      } else if (data && data.length > 0) {
        setAccounts([...accounts, data[0]])
      } else {
        setAccounts([...accounts, newAcc])
      }
    } catch (err) {
      setAccounts([...accounts, newAcc])
    }
    
    const inputEl = document.getElementById('new-agent-name')
    if (inputEl) inputEl.value = ''
  }

  const selectAccount = (acc) => {
    setActiveAccount(acc)
    setScore(acc.score)
    setCurrentLevelIdx(acc.unlockedLevel - 1)
    setCurrentChallengeIdx(acc.unlockedChallenge - 1)
    setScreen('map')
  }

  const unlockAllLevels = () => {
    const updated = accounts.map(a => a.id === activeAccount.id ? { ...a, unlockedLevel: 20, unlockedChallenge: 10 } : a)
    setAccounts(updated)
    setActiveAccount(prev => ({ ...prev, unlockedLevel: 20, unlockedChallenge: 10 }))
  }

  const handleSolve = () => {
    const level = gameData[currentLevelIdx]
    const challenge = level.challenges[currentChallengeIdx]

    if (puzzleInput.trim().toLowerCase() === challenge.a.toLowerCase()) {
      const bonus = timeLeft * 5
      const newScore = score + bonus
      setScore(newScore)
      
      let nextL = currentLevelIdx
      let nextC = currentChallengeIdx + 1

      if (nextC >= CHALLENGES_PER_LEVEL) {
        nextL++
        nextC = 0
      }

      if (nextL >= LEVELS_COUNT) {
        setScreen('victory')
      } else {
        broadcastProgress(activeAccount.name, currentLevelIdx + 1, currentChallengeIdx + 1)
        
        setCurrentLevelIdx(nextL)
        setCurrentChallengeIdx(nextC)
        setPuzzleInput('')
        setTimeLeft(720)
        setShowAnswer(false)

        // Badge check
        const earnedBadges = BADGES.filter(b => (nextL + 1) >= b.minLevel).map(b => b.name)

        // Update persistence
        const updatedAcc = {
          ...activeAccount,
          score: newScore,
          badges: earnedBadges,
          unlockedLevel: Math.max(activeAccount.unlockedLevel, nextL + 1),
          unlockedChallenge: nextL + 1 > activeAccount.unlockedLevel ? nextC + 1 : Math.max(activeAccount.unlockedChallenge, nextC + 1)
        }

        const updatedAccs = accounts.map(a => a.id === activeAccount.id ? updatedAcc : a)
        setAccounts(updatedAccs)
        setActiveAccount(updatedAcc)

        // Supabase Sync
        supabase.from('agents').update(updatedAcc).eq('id', activeAccount.id).then(({error}) => {
            if (error) console.error("Eroare update:", error.message)
        })
      }
    } else {
      alert('Cod incorect!')
    }
  }

  if (screen === 'accounts') {
    return (
      <div className="card accounts-container">
        <div>
          <h1>Alege <span className="accent-text">Agentul</span></h1>
          <p style={{ marginBottom: '20px' }}>Selectează un agent existent sau înrolează unul nou pentru a începe misiunea.</p>
        </div>
        
        <div className="agents-list">
          {isLoading ? (
            <p style={{ textAlign: 'center', margin: '20px' }}>Se încarcă baza de date...</p>
          ) : accounts.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--text-dim)' }}>Niciun agent înregistrat. Fii tu primul!</p>
          ) : (
            accounts.map(acc => (
              <button key={acc.id} onClick={() => selectAccount(acc)} className="btn-secondary" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '5px' }}>
                  <span style={{ fontWeight: 800 }}>{acc.name}</span>
                  <span className="accent-text">Scor: {acc.score}</span>
                </div>
                <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                  {acc.badges?.map((b, i) => <span key={i} title={b} style={{ fontSize: '1.2rem' }}>{b.split(' ').pop()}</span>)}
                </div>
              </button>
            ))
          )}
        </div>

        <div className="create-agent-section">
          <h2 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>Înregistrare <span style={{ color: 'var(--neon-blue)' }}>Agent Nou</span></h2>
          <div className="input-group" style={{ marginTop: '0' }}>
            <input 
              type="text" 
              placeholder="Introdu numele de cod (Ex: Shadow)" 
              id="new-agent-name"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const el = document.getElementById('new-agent-name')
                  if (el) createAccount(el.value)
                }
              }}
            />
            <button className="btn-primary" onClick={() => {
              const el = document.getElementById('new-agent-name')
              if (el) createAccount(el.value)
            }}>
              Creează Cont
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (screen === 'map') {
    return (
      <div className="card" style={{ maxWidth: '800px' }}>
        <div className="header">
          <h1>Harta <span className="accent-text">Misiunilor</span></h1>
          <p>Agent: {activeAccount.name} | Scor: {score}</p>
          <div style={{ marginTop: '10px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <input 
              type="text" 
              placeholder="Cod Cameră (Ex: BETA)" 
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              style={{ padding: '8px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--glass-bg)', color: 'white', flex: 1 }}
            />
            <button onClick={() => setActiveRoom(roomCode)} className="btn-primary" style={{ padding: '8px 15px' }}>{activeRoom ? 'Conectat ✓' : 'Intră Online'}</button>
          </div>
          <div style={{ marginTop: '15px', padding: '10px', background: 'rgba(0, 243, 255, 0.1)', border: '1px solid var(--neon-blue)', borderRadius: '12px', textAlign: 'center' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--neon-blue)', fontWeight: 800 }}>
              🎯 OBIECTIV CURENT: NIVEL {activeAccount.unlockedLevel} - PROVOCAREA {activeAccount.unlockedChallenge}/10
            </span>
          </div>
        </div>

        {/* Notifications Layer */}
        <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 1000, display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {notifications.map(n => (
            <div key={n.id} style={{ background: 'rgba(57, 255, 20, 0.9)', color: 'black', padding: '10px 20px', borderRadius: '10px', fontWeight: 'bold', animation: 'slideIn 0.3s ease-out' }}>
              {n.msg}
            </div>
          ))}
        </div>

        <div className="mission-map">
          {gameData.map((level, lIdx) => {
            const isLocked = lIdx + 1 > activeAccount.unlockedLevel
            return (
              <div 
                key={level.id} 
                className={`level-node ${isLocked ? 'locked' : ''} ${currentLevelIdx === lIdx ? 'active' : ''}`}
                onClick={() => {
                  if (isLocked) return
                  setCurrentLevelIdx(lIdx)
                  // If entering a previously completed level, start from challenge 0; otherwise resume
                  const resumeChallenge = lIdx + 1 === activeAccount.unlockedLevel
                    ? activeAccount.unlockedChallenge - 1
                    : 0
                  setCurrentChallengeIdx(resumeChallenge)
                  setPuzzleInput('')
                  setTimeLeft(720)
                  setShowAnswer(false)
                  setScreen('puzzle')
                }}
              >
                <div className="level-number">{level.id}</div>
                <div className="level-checkpoints">
                  {level.challenges.map((_, cIdx) => (
                    <div key={cIdx} className={`dot ${ (lIdx + 1 < activeAccount.unlockedLevel || (lIdx + 1 === activeAccount.unlockedLevel && cIdx + 1 < activeAccount.unlockedChallenge)) ? 'done' : ''}`} />
                  ))}
                </div>
                <div style={{ fontSize: '0.7rem', opacity: 0.7, marginTop: '4px' }}>{isLocked ? '🔒' : '▶'}</div>
              </div>
            )
          })}
        </div>
        <button className="btn-primary" style={{ marginTop: '20px', background: 'var(--neon-green)', color: '#000' }} onClick={unlockAllLevels}>
          🔓 Deblochează Toate Nivelele
        </button>
        <button className="btn-secondary" style={{ marginTop: '10px' }} onClick={() => setScreen('accounts')}>Schimbă Agentul</button>
      </div>
    )
  }

  if (screen === 'puzzle') {
    const level = gameData[currentLevelIdx]
    const challenge = level.challenges[currentChallengeIdx]
    return (
      <div className="card puzzle-card">
        <div className="game-status">
          <div className="stat">⏳ {timeLeft}s</div>
          <div className="stat">⭐ {score}</div>
        </div>
        <div className="header">
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
            <span className="badge" style={{ fontSize: '1rem', padding: '8px 20px', background: 'var(--neon-blue)', color: 'black' }}>
               NIVEL {currentLevelIdx + 1} - PROVOCAREA {currentChallengeIdx + 1}/10
            </span>
          </div>
          <h1>Evasion <span className="accent-text">Mode</span></h1>
          <p style={{ fontWeight: 600, color: 'var(--neon-green)' }}>{level.title}</p>
          <p>Rezolvă puzzle-ul pentru a debloca următorul segment.</p>
        </div>

        <div className="puzzle-box">
          <p className="riddle">{challenge.q}</p>
        </div>

        <div className="input-group">
          <input 
            type="text" 
            placeholder="Introduceți răspunsul" 
            value={puzzleInput}
            onChange={(e) => setPuzzleInput(e.target.value)}
          />
          <button className="btn-primary" onClick={handleSolve}>
            Verifică
          </button>
        </div>

        <button className="btn-secondary" style={{ marginTop: '20px' }} onClick={() => setScreen('map')}>Harta Misiunilor</button>
      </div>
    )
  }

  return (
    <div className="card">
      <h1>Misiune <span className="accent-text">Finalizată</span></h1>
      <p>Felicitări, Agent {activeAccount.name}!</p>
      <div className="score-display">Scor Total: {score}</div>
      <button className="btn-primary" onClick={() => setScreen('accounts')}>Meniu Principal</button>
    </div>
  )
}

export default App
