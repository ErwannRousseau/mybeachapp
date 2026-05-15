# My Beach App

My Beach App helps adults, locals, and vacationers discover, create, and join geolocated beach activities nearby. This context exists to keep product language consistent across mobile, backend, admin, and shared contracts.

## Language

**Beach Activity**:
A spontaneous geolocated activity happening at or near a beach with a place, time, category, duration, and participant capacity.
_Avoid_: Event, meetup, session, listing

**Participant**:
A **Signed-in User** who joins a **Beach Activity**.
_Avoid_: Player, attendee, member

**Organizer**:
A **Signed-in User** who creates, modifies, or cancels a **Beach Activity**.
_Avoid_: Creator, host, owner

**Visitor**:
A person using My Beach App without being signed in.
_Avoid_: Anonymous user, guest, prospect

**Signed-in User**:
A person with an account who can create and join **Beach Activities**.
_Avoid_: Account, auth user, member

**Spot**:
A participant place counted against the capacity of a **Beach Activity**.
_Avoid_: Slot, seat, ticket

**Meeting Point**:
The precise rendezvous point where participants should gather for a **Beach Activity**.
_Avoid_: Address, venue, location details

**Place**:
The beach, city, or nearby area used to discover or position a **Beach Activity**.
_Avoid_: Location, venue, address

**GPS Pin**:
The manually adjustable map marker for a **Meeting Point**.
_Avoid_: Marker, coordinate, location

**Participation**:
The record that a **Signed-in User** has joined or cancelled joining a **Beach Activity**.
_Avoid_: Registration, booking, enrollment

**Pilot Zone**:
The initial test area covering Pornichet, La Baule, and nearby Loire-Atlantique beaches.
_Avoid_: Market, region, launch area

**Activity Category**:
The kind of **Beach Activity**, such as ball sport, water sport, racket sport, fitness wellness, walking running, beach games, social, or other.
_Avoid_: Type, tag, sport

**Activity Status**:
The availability state of a **Beach Activity**: open, full, cancelled, or finished.
_Avoid_: State, lifecycle, phase

**Activity Sheet**:
The detailed screen for a **Beach Activity** showing details, map, participants, remaining spots, and join/cancel actions.
_Avoid_: Detail page, event page, card

## Relationships

- A **Visitor** may view open **Beach Activities**
- A **Signed-in User** may organize zero or more **Beach Activities**
- A **Beach Activity** has exactly one **Organizer**
- A **Beach Activity** has one **Activity Category** and one **Activity Status**
- A **Beach Activity** has one **Place**, one **Meeting Point**, and one **GPS Pin**
- A **Beach Activity** has two to thirty **Spots**
- A **Signed-in User** may have zero or more **Participations**
- A **Participation** belongs to exactly one **Signed-in User** and exactly one **Beach Activity**
- A **Participant** is a **Signed-in User** with a joined **Participation**
- A **Beach Activity** is discoverable in the **Pilot Zone** during the MVP
- An **Activity Sheet** belongs to exactly one **Beach Activity**

## Example dialogue

> **Dev:** "When a **Signed-in User** creates a **Beach Activity** from the map, do we create a **Participation** too?"
> **Domain expert:** "Yes — the **Organizer** is automatically a **Participant**, their **Meeting Point** comes from the adjusted **GPS Pin**, and the remaining **Spots** decide whether other users can join."

## Flagged ambiguities

- "user" can mean a Better Auth record, an app profile, a **Visitor**, or a **Signed-in User** — resolved: use **Signed-in User** for the product actor with an account.
- "location" can mean coordinates, a searchable city/beach/address, or gathering instructions — resolved: use **Place** for discovery, **GPS Pin** for map coordinates, and **Meeting Point** for where participants gather.
- "creator" appears in storage fields but product language should say **Organizer**.
- "place" and "spot" can be confused in English — resolved: **Place** is where the activity happens, **Spot** is participant capacity.
- "Beach Activity" currently uses broad code categories, while the product source names pilot activities such as beach-volley, paddle, surf, yoga, petanque, running, and swimming — resolved: keep **Activity Category** broad in code and use pilot activity names in product copy.
