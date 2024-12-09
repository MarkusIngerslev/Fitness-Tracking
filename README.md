# Fitness - Tracker

Dette er et projekt lavet til Mobile development - 4. semesters eksamen.

#### Synopse af appen

En bruger kan login, og få vist personligt data over deres tidligere workouts, eller logge nye øvelser samt tage billeder af deres fremskridt og se statistikker.

Det er også muligt for en bruger at spore løberuter eller gåture, gennem brugen af en map funktion.


### Benyttet teknologier / emner fra undervisning

Til udviklingen af denne app har jeg benyttet blandt andet følgende emner fra undervisningen:

- List
- Firebase 
    - CRUD
    - Storage
    - Google/Firebase login
- Map (google maps)
- Animationer
- Gestures
- Context

### Ønskede features ved slut

Funktionalitet og Komponenter

- [x] **Brugerlogin (Google/Firebase)** 
    - Start med en login-skærm, hvor brugeren kan logge ind med Google. Brug Firebase Authentication til at administrere loginoplysningerne.

- [x] **Hovedskærm (Dashboard)** 
    - Komponenter: Text, Button, List
    - Vis daglig træningsstatistik, hurtig adgang til træningslogning, og se fremskridt.
    - Brug useState og useEffect til at hente data og opdatere brugerens statistikker.

- [x] **Træningslogning** 
    - Formular til træning: Opret en skærm til logning af daglige øvelser. Brug TextInput til at tilføje øvelsesnavne, tid og gentagelser. Gem dataen i Firebase Firestore.
    - Liste over øvelser: Vis tidligere gemte øvelser i en liste, og gør det muligt at redigere og slette dem.

- [x] **Fremskridtstracking med Billeder**
    - Brug Camera eller Photos til at tage billeder af brugerens fremskridt.
    - Gem billederne i Firebase Storage, og vis dem på en "Fremskridt"-skærm.
    - Tilføj en knap til at uploade eller tage nye billeder.

- [ ] **Kort (Map) til Tracking af Løberuter**
    - Brug MapView til at spore brugerens løbe- eller gåture. Implementér en simpel tracker, der viser ruten på kortet.
    - Brug Firebase Firestore til at gemme ruter og vise dem senere.

- [ ] **Gestures og Animation**
    - Brug Gestures til at swipe mellem de forskellige hovedskærme (f.eks. dashboard, fremskridt, og træning).
    - Brug Animationer til at gøre overgange mellem skærme og elementer mere engagerende. Fx animér visning af statistikker eller når brugeren afslutter en træning.

- [ ] **Brugerindstillinger og Context**
    - Brug Context til at holde styr på brugerens data på tværs af appen, som fx præferencer og mål.
    - Tilføj en skærm til at ændre brugerindstillinger som mål for daglig aktivitet eller vægttabs-/muskelopbygningsmål.

- [ ] **Styling med TailwindCSS**
    - Hvis finder tid til det, kan jeg bruge TailwindCSS (via Tailwind-styling til React Native, som f.eks. tailwind-rn) for at lave en konsistent og let vedligeholdelig styling af appen.