---
title: BBQ Valley
draft: false
tags:
  - gamedev
  - personal
---

<a style="font-size: 1.5rem;" href="https://rambertheone.github.io/BBQValley/" target="_blank">Go barbecue</a>
 
## ✒️ Description
In this rogue like game, you play as a hungry farmer looking to eat the rarest meat of them all which was a giant boar. He needs to get pass from a bunch of other animals defending this boar so that he can claim the meat an enjoy himself with the delicous giant boar meat.
## 🕹️ Gameplay
The player has to pass 3 chambers before fighting the boss. For each chamber the player needs to kill all the enemies before they are able to move on to the next chamber. All chambers will have different enemies in them. At the final chamber, you need to fight the boss and if you succeed, then he'll drop some meat that the player will collect.

## 📃 Requirements
1. A controllable player
2. The player is able to move around using the key A, W, S, D
3. The player is able to attack enemies with its weapon
4. The enemies are able to attack the player which causes the player to lose health
5. The player must kill all enemies in the chamber before proceeding with the next chamber
6.  The player must kill the final boss with multiple hits and pickup the meat it drops to win
7.  If player loses all their health, they lose and must start from the beginning
8.  The player will be brought to the main menu screen to see if they are ready toi play
9.  A camera will follow the player around
10.  The player can collect hearts and weapons
### 🤖 State Diagram

## Game
```mermaid
stateDiagram-v2
    [*] --> StartScreen

    StartScreen --> Dungeon: Start Game
    Dungeon --> FightingMonsters: Enter Dungeon

    FightingMonsters --> MonsterDefeated: Defeat Monster
    MonsterDefeated --> LootCollected: Collect Loot
    LootCollected --> FightingMonsters: Continue Fighting

    FightingMonsters --> DoorUnlocked: All Monsters Defeated
    DoorUnlocked --> NextDungeon: Open Door
    NextDungeon --> Dungeon

    FightingMonsters --> BossBattle: After Several Dungeons
    BossBattle --> BossDefeated: Defeat Boss
    BossDefeated --> CollectibleItemObtained: Collect Item
    CollectibleItemObtained --> VictoryScreen: End Game

    BossBattle --> GameOver: Player Defeated
    FightingMonsters --> GameOver: Player Defeated
    VictoryScreen --> StartScreen
    GameOver --> StartScreen

```

## Player
```mermaid
stateDiagram-v2
    [*] --> Idle

    Idle --> Fighting: Encounter Monster
    Fighting --> Attacking: Player Attacks Monster
    Attacking --> Fighting: Attack Ends
    
    Fighting --> CollectingLoot: Defeat Monster
    CollectingLoot --> UsingHeart: Collect Heart
    UsingHeart --> Idle: Health Restored
    
    CollectingLoot --> EquippingWeapon: Collect Weapon
    EquippingWeapon --> Idle: Strength Increased
    
    Idle --> BossFight: Encounter Boss
    BossFight --> Attacking: Attack Boss
    Attacking --> BossFight: Attack Ends
    
    BossFight --> CollectingItem: Boss Defeated
    CollectingItem --> Idle: Item Collected
```

### 🗺️ Class Diagram

```mermaid
  classDiagram
    class Player {
        +String name
        +int health
        +int strength
        +List~Item~ inventory
        +attack(target: Monster): void
        +collect(item: Item): void
        +equipWeapon(weapon: Weapon): void
        +barbecue(meat: Meat): void
    }

    class Monster {
        <<abstract>>
        +String name
        +int health
        +int damage
        +attack(player: Player): void
        +dropLoot(): Item
    }

    class Chicken {
        +cluck(): void
    }

    class Cow {
        +moo(): void
    }

    class Pig {
        +oink(): void
    }

    class Boss {
        +String specialAttack
        +useSpecialAttack(player: Player): void
    }

    class Item {
        <<abstract>>
        +String name
        +String type
        +use(player: Player): void
    }

    class Barbecue {
        +bool isBarbecuing
        +animation(): void
    }

    class Meat {
        <<abstract>>
        +String powerUpType
        +bool isCooked
        +use(player: Player): void
    }

    class ChickenMeat {
        +String specificBoost
    }

    class CowMeat {
        +String specificBoost
    }

    class PigMeat {
        +String specificBoost
    }

    class BossMeat {
        +String specificBoost
    }

    class Weapon {
        <<abstract>>
        +int attackPower
        +use(player: Player): void
        +equip(player: Player): void
    }

    class MeleeWeapon {
        +int range
        +slash(): void
    }

    class LongRangeWeapon {
        +int ammoCount
        +shoot(): void
        +reload(): void
    }

    class Dungeon {
        +int level
        +List~Monster~ monsters
        +Boss boss
        +enter(player: Player): void
        +clear(): bool
    }

    class Door {
        +bool isLocked
        +unlock(): void
        +lock(): void
    }

    class MonsterFactory {
        +createMonster(type: String): Monster
    }

    class MeatFactory {
        +createMeat(type: String): Monster
    }
    MonsterFactory --> Monster : creates
    MeatFactory --> Meat : creates
    Item <|-- Meat
    Meat <|-- ChickenMeat
    Meat <|-- CowMeat
    Meat <|-- PigMeat
    Meat <|-- BossMeat
    Item <|-- Weapon
    Item <|-- Barbecue
    Monster <|-- Chicken
    Monster <|-- Cow
    Monster <|-- Pig
    Monster <|-- Boss
    Weapon <|-- MeleeWeapon
    Weapon <|-- LongRangeWeapon
    Player  -- Item : collects
    Player  --  Monster : attacks
    Player -- Meat : has
    Dungeon --  Monster : contains
    Dungeon --  Boss : has
    Dungeon -- Barbecue
    Dungeon --  Door : leads to
    Player --  Door : unlocks
    Monster -- Item : drops
```
