1. Klassiruumi planeering (Blueprint) (1hr)
Lõime klassiruumi struktuuri, kasutades A-Frame’i primitiive nagu <a-box>, <a-plane> ja <a-cylinder>.

Loogika: Selle asemel, et iga lauda eraldi kirjutada, kasutasime JavaScripti .map() funktsiooni, et genereerida õpilaste töökohad massiivide põhjal. See võimaldas luua sümmeetrilise paigutuse (nii vasakule kui paremale poole vahekäiku) minimaalse koodihulgaga.

2. Karakterite süsteem (30min)
Lisasime stseeni välised 3D-mudelid, kasutades <a-entity> elementi koos gltf-model komponendiga.

Peenhäälestus: Mudelite (õpetaja ja õpilane) suurust ja kuju muutsime atribuudi scale abil. Näiteks kasutasime scale="3.8 4.8 3.8", et muuta karakterid visuaalselt "peenemaks", mis aitab neil mahtuda laudade vahele ilma füüsikamootori takistusteta.

3. Liikumine ja vaate juhtimine (GTA-stiilis) (4hr)
Karakteri juhtimine on jaotatud kaheks spetsiaalseks A-Frame'i komponendiks, mille me registreerisime AFRAME.registerComponent abil:

mouse-look-rig: See komponent tegeleb hiire sisendiga. See arvutab hiire liikumise (onMouseMove) põhjal karakteri pööramise (yaw) ja kaamera kallutamise (pitch). See võimaldabki meil hiirega ringi vaadata ilma, et terve karakter imelikult kalduks.

character-controller: See komponent tegeleb liikumisega. See kuulab klahvivajutusi (WASD) ja arvutab tick() funktsiooni sees välja liikumissuuna vastavalt sellele, kuhu poole mängija parajasti vaatab.

4. Füüsika ja kokkupõrked (Collision) (6hr)
Kasutasime aframe-physics-system’it, et muuta maailm "tahkeks".

dynamic-body: Määrasime mängija keha (rig) dünaamiliseks, kasutades kera kuju (shape: sphere; sphereRadius: 0.4), mis muudab takistuste vahel libisemise sujuvamaks.

static-body: Kõik seinad ja lauad said selle atribuudi, mis tähendab, et need on liikumatud takistused.

Box Colliders: Kuna toolide ja laudade 3D-mudelid on keerulised, lisasime nende ümber lihtsad nähtamatud <a-box> elemendid koos static-body'ga. See optimeerib jõudlust ja muudab kokkupõrked täpsemaks. Kasutasime koodis position ja width/depth parameetreid, et nihutada need "colliderid" täpselt laudade alla, jättes vahekäigud vabaks.