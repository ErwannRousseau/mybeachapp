# Prototype carte et géocodage mobile

Date : 15 août 2026  
Base : `develop` à `8a2f7bd`  
Branche jetable : `feature/prototype-map-geocoding`

Cette note consigne les preuves du prototype demandé par les tickets Wayfinder
[#64](https://github.com/ErwannRousseau/mybeachapp/issues/64) et
[#69](https://github.com/ErwannRousseau/mybeachapp/issues/69). Elle ne constitue
ni le choix final des stacks, ni une architecture de production.

## Périmètre prototypé

- écran index remplacé par une carte MapLibre plein écran ;
- candidat A : MapLibre React Native + style OpenFreeMap Liberty ;
- candidat B : MapLibre React Native + style Geoapify OSM Bright Smooth ;
- 24 points d'activité, clustering, zoom de cluster et animation de caméra ;
- `GPS Pin` déplaçable au toucher ou par glissement ;
- recherche `Place` via IGN Géoplateforme et `geo.api.gouv.fr/communes` ;
- sélection du résultat, déplacement de caméra, géocodage inverse IGN ;
- libellé de `Meeting Point` éditable pour le fallback manuel.

Les deux candidats cartographiques partagent volontairement le même moteur
MapLibre et les mêmes calques. Le prototype compare ainsi la source de carte,
son style, sa configuration et ses contraintes, pas deux implémentations UI
différentes.

## Builds et environnement

Les dépendances ont été installées avec `bun install --frozen-lockfile`. La
dépendance native `@maplibre/maplibre-react-native` et son plugin Expo ont été
ajoutés, puis les projets natifs ont été régénérés par Expo Prebuild.

| Plateforme | Cible | Commande | Résultat |
| --- | --- | --- | --- |
| iOS Debug | iPhone 17 Pro Simulator | `bun run dev`, puis `bun run ios` | build, installation, Metro et carte OK |
| iOS Release | iPhone 17 Pro Simulator | `bunx expo run:ios --configuration Release --device "iPhone 17 Pro" --no-bundler` | build et bundle embarqué OK sans Metro |
| Android Release | Medium Phone API 35 | `bunx expo run:android --variant release --device "Medium_Phone_API_35" --no-bundler` | `BUILD SUCCESSFUL` en 9 min 35 s, APK installé et lancé |

Le build iOS Release a produit quatre avertissements natifs non bloquants. Le
build Android Release signale des API Gradle/Kotlin dépréciées et une limite de
Metaspace du daemon, sans erreur de compilation.

Tailles indicatives des artefacts simulateur/universels, non comparables à des
binaires Store découpés :

- application iOS Release Simulator : 110 MiB ;
- APK Android Release universel quatre ABI : 145,7 MiB.

## Diagnostic du démarrage défaillant

Le symptôme initial était un retour immédiat au splash sans carte. La réduction
du cas a donné la séquence suivante :

1. écran React Native minimal : stable ;
2. MapLibre + OpenFreeMap minimal : stable ;
3. source GeoJSON seule : stable ;
4. cercle de cluster : stable ;
5. texte du compteur de cluster avec `Open Sans Semibold` : échec reproductible.

Le style OpenFreeMap Liberty ne fournit que les glyphes `Noto Sans`. La couche
de compteur demandait `Open Sans Semibold`, ce qui provoquait une réponse 404
pendant le chargement du style et empêchait l'écran complet de se stabiliser.
La couche utilise maintenant `Noto Sans Bold`, effectivement fournie par le
style. Le même écran complet est ensuite resté stable en Debug et en Release.

Un second défaut Release a été trouvé avant ce diagnostic : passer l'objet
`process.env` entier au validateur empêche Expo d'intégrer statiquement les
variables publiques. Les accès sont désormais explicites
(`process.env.EXPO_PUBLIC_…`), ce qui supprime la `ZodError` du bundle Release.

La régression de police se vérifie à la frontière réelle fournisseur/SDK ; un
test unitaire isolé ne reproduirait pas le chargement des glyphes. Le gate utile
est donc le lancement Release avec le style distant et le calque de compteur.

## Résultats cartographiques

### Candidat A — MapLibre + OpenFreeMap

Validé réellement sur iOS Debug, iOS Release et Android Release :

- rendu plein écran dès l'index ;
- pan, recentrage animé et caméra `flyTo` ;
- 24 points, cercles de clusters et compteurs ;
- appui sur un cluster : zoom d'expansion et redistribution des groupes ;
- `GPS Pin` visible, repositionnement au toucher ;
- glissement réel du `GPS Pin` validé en Android Release ;
- changement de style à chaud puis retour à OpenFreeMap ;
- UI Tamagui lisible au-dessus de la carte sur les deux plateformes.

Temps observés, indicatifs car le cache, le réseau local et les simulateurs ne
sont pas contrôlés :

- iOS Release : lancement chaud 908 ms, carte prête 414 ms ;
- Android Release : lancement par l'outil 4 943 ms, première carte prête
  2 427 ms, rechargement du style 619 ms.

MapLibre émet aussi un avertissement `Invalid geometry in line layer` provenant
du style de base OpenFreeMap. Il n'a pas empêché le rendu ou les gestes, mais il
doit être surveillé lors d'une mise à jour du style.

### Candidat B — MapLibre + Geoapify

Le sélecteur charge bien l'URL de style Geoapify prévue et la bascule est
exercée sur iOS et Android. Sans `EXPO_PUBLIC_GEOAPIFY_MAP_KEY`, l'écran expose
explicitement `clé Geoapify absente` et le fournisseur répond 401.

Aucun compte ni clé n'a été créé pendant ce prototype. En conséquence, le rendu,
la qualité visuelle, la latence et la stabilité de Geoapify n'ont pas été
mesurés. Le ticket #64 ne peut pas être résolu tant que le candidat B n'est pas
testé avec une clé Free sans carte bancaire et sans facturation automatique, ou
explicitement éliminé par la décision de coût/configuration.

### Performance et stabilité

Sur l'émulateur Android API 35, un échantillon contrôlé de trois mouvements a
compté 15 frames hors délai sur 25 (60 %), avec une pire frame à 81,1 ms. La
mémoire PSS observée était d'environ 316 MiB. Ce résultat est un signal de jank,
pas une mesure représentative d'un téléphone réel.

Le simulateur iOS ne permet pas à `agent-device` de collecter un taux de frames
fiable. La mémoire résidente observée était d'environ 524 MiB, valeur également
spécifique au simulateur. La performance ne doit donc pas être déclarée validée
avant un passage Release sur au moins un appareil physique iOS et Android.

Une interaction pratique à corriger dans l'implémentation finale a également
été révélée : l'appui sur un cluster déclenche le zoom mais peut aussi remonter
jusqu'au handler global de carte et déplacer le `GPS Pin`. Il faudra arbitrer
les événements de calque et de carte.

## Résultats de géocodage

### Recherche avant

Le parcours réel iOS Debug a cherché `Plage des Libraires Pornichet` :

- 1 résultat utile ;
- IGN : 214 ms ;
- communes : 172 ms ;
- total parallèle : 224 ms ;
- sélection : déplacement de caméra et positionnement du `GPS Pin` à
  `47.270832, -2.353059`.

Les appels directs utilisés pour qualifier l'adaptateur ont aussi validé :

- plage : `Plage des Libraires`, Pornichet ;
- ville : `Pornichet` ;
- commune : code INSEE `44132` via `geo.api.gouv.fr/communes` ;
- coordonnées conformes aux bornes latitude/longitude du domaine.

### Déplacement et géocodage inverse

Les parcours réels suivants ont été validés :

- iOS Debug, toucher de carte : `11 Avenue de l'Océan 44380 Pornichet`,
  réponse IGN 45 ms ;
- Android Release, toucher de carte :
  `5 Rue des Tranchées 44600 Saint-Nazaire`, réponse IGN 1 261 ms ;
- Android Release, glissement du `GPS Pin` de
  `47.28889, -2.30344` vers `47.28442, -2.31324` :
  `1571 Route de L'immaculée 44500 La Baule-Escoublac`, réponse IGN 718 ms.

Le champ `Meeting Point` reste éditable après une réponse ou un échec réseau :
le fallback manuel est donc présent dans le prototype.

### Limites de validation

- la commande `agent-device keyboard enter`, annoncée par l'aide installée,
  est rejetée à l'exécution et n'accepte actuellement que `status`/`dismiss` ;
- la recherche avant a donc été exercée en Debug iOS, mais pas déclenchée par
  l'automatisation dans les deux builds Release ;
- les limites de débit documentées par l'IGN n'ont pas été stress-testées afin
  de ne pas produire de charge abusive ;
- aucun scénario réseau hors ligne ou timeout forcé n'a été injecté ;
- aucun appareil physique n'était connecté.

Le ticket #69 possède une preuve forte pour les réponses France, la sélection,
le déplacement et le géocodage inverse, mais la matrice Release iOS + Android
reste incomplète pour la recherche avant et la dégradation réseau.

## Coût, clés et configuration

- OpenFreeMap ne requiert aucune clé dans le prototype ;
- MapLibre nécessite Expo Prebuild et ajoute une dépendance native au binaire ;
- Geoapify nécessite une clé publique embarquée et des restrictions adaptées ;
- IGN Géoplateforme et `geo.api.gouv.fr/communes` ne nécessitent pas de secret
  client pour ce prototype ;
- aucune carte bancaire, compte fournisseur ou facturation n'a été introduit ;
- les variables `EXPO_PUBLIC_*` sont publiques par définition et ne doivent
  jamais contenir un secret serveur.

La recherche #62 associait Geoapify Search aux deux candidats cartographiques,
alors que la recherche France #63 recommande IGN + communes. Le prototype
confirme que le géocodage peut rester indépendant du fournisseur de tuiles et
que l'IGN donne de meilleurs résultats adaptés au parcours français étudié.

## Fichiers du prototype

- `apps/mobile/app/(tabs)/index.tsx` : route index simplifiée ;
- `apps/mobile/src/features/map/prototype-map-screen.tsx` : écran jetable ;
- `apps/mobile/src/features/map/prototype-geocoding.ts` : appels et validation ;
- `apps/mobile/src/features/map/__tests__/prototype-geocoding.test.ts` : tests
  minimaux de parsing et fusion ;
- `apps/mobile/app.config.ts` : plugin MapLibre ;
- `apps/mobile/package.json` et `bun.lock` : dépendance native ;
- `apps/mobile/src/config/env.ts` : accès statiques aux variables Expo.

L'écran, ses points fictifs, le sélecteur A/B, ses métriques affichées et le
client de géocodage sont volontairement jetables. Le plugin Expo, la dépendance
et le correctif d'accès statique aux variables ne doivent être conservés que si
les décisions Wayfinder suivantes les valident.

## Vérifications automatisées

- `bun run check:fix` : succès ;
- `bun run check` : succès ;
- `bun run typecheck` : succès ;
- `bun run test` : succès, dont 22 fichiers et 70 tests mobile ;
- tests ciblés environnement + géocodage : 10 succès, 0 échec ;
- `git diff --check` : succès.

## État Wayfinder après prototype

- #64 reste ouvert : candidat B non mesuré et performance physique absente ;
- #69 reste ouvert : parcours principal probant, matrice Release incomplète ;
- #65 reste ouvert : aucune stack cartographique finale choisie ;
- #66 est prêt pour le grilling sur IGN + communes, sans préjuger de sa clôture ;
- #67 reste ouvert : clés, restrictions, quotas, attribution et dégradation à
  décider après le sort du candidat B ;
- #68 reste ouvert : doit intégrer le gate appareil physique, le conflit
  cluster/`GPS Pin`, les builds Release et les tests de dégradation.

## Prochaine action recommandée

Continuer #64, sans ouvrir de ticket parallèle : obtenir une clé Geoapify Free
sans carte bancaire ni facturation automatique, puis exécuter exactement le
même écran et le même scénario Release sur iOS et Android physiques. Si cette
clé ne respecte pas le gate de coût, documenter son élimination dans #64. En
parallèle, refaire le submit de recherche #69 avec une version corrigée de
`agent-device` ou une action de soumission temporaire accessible dans le
prototype. Les grillings #65 à #68 viennent seulement après ces preuves.
