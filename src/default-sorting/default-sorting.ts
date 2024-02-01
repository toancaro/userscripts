import { ICard } from './card.type';

export class DefaultSorting {
  private constructor() {
    this.startWatchSvelteKitFetch();
  }

  private startWatchSvelteKitFetch() {
    let currSvelteKitFetch = unsafeWindow.svelteKitFetch;

    const intervalId = setInterval(() => {
      if (currSvelteKitFetch === unsafeWindow.svelteKitFetch) return;

      const origsvelteKitFetch = unsafeWindow.svelteKitFetch;

      const svelteKitFetch = function customSvelteKitFetch() {
        const args = Array.from(arguments);
        return origsvelteKitFetch.apply(unsafeWindow, args).then(async (result: Response) => {
          // /api/v1/cards?search=kashtira&cardSort=release&aggregate=search&page=2&limit=63
          const endpointUrl = arguments[0];
          const isSortByRelease = /^\/api\/v1\/cards.*?cardSort=-?release/.test(endpointUrl);
          const isGetCount = /count=true/.test(endpointUrl);

          // Chỉ modify khi sort là release và get cards chứ ko phải count
          if (isSortByRelease && !isGetCount) {
            const json = (await result.clone().json()) as ICard[];
            console.log('svelteKitFetch result', json);

            const sortedCards = json.sort((c1, c2) => {
              const card1String = DefaultSorting.getCardCompareString(c1);
              const card2String = DefaultSorting.getCardCompareString(c2);
              return card1String.localeCompare(card2String);
            });

            const response = Response.json(sortedCards);
            return response;
          }
          // Nếu không thì trả về nguyên vẹn result
          else {
            return result;
          }
        });
      };

      unsafeWindow.svelteKitFetch = currSvelteKitFetch = svelteKitFetch;
    }, 1000);

    console.log('🚀 ~ DefaultSorting ~ startWatchSvelteKitFetch ~ intervalId:', intervalId);
  }

  private static getCardCompareString(card: ICard) {
    const compareMonster = `${getMonsterType()}-${getIsEffectMonster()}-${getMonsterLevel()}-${getMonsterRace()}-${getMonsterAttribute()}`;
    const compareSpellTrap = getSpellTrapRace();
    const compareString = `${getCardType()}-${compareMonster}-${compareSpellTrap}-${getCardName()}`;
    return compareString;

    function getCardType() {
      switch (card.type) {
        case 'Monster':
          return 1;
        case 'Spell':
          return 2;
        case 'Trap':
          return 3;
        default:
          throw new Error(`Không lấy được compare string cho card type: '${card.type}'`);
      }
    }

    function getMonsterType() {
      const monsterTypes = card.monsterType || [];

      if (monsterTypes.length === 0) {
        return '00';
      } else if (monsterTypes.includes('Pendulum')) {
        if (monsterTypes.includes('Ritual')) {
          return '03';
        } else if (monsterTypes.includes('Fusion')) {
          return '04';
        } else if (monsterTypes.includes('Synchro')) {
          return '05';
        } else if (monsterTypes.includes('Xyz')) {
          return '06';
        } else {
          return '02';
        }
      } else if (monsterTypes.includes('Ritual')) {
        return '07';
      } else if (monsterTypes.includes('Fusion')) {
        return '08';
      } else if (monsterTypes.includes('Synchro')) {
        return '09';
      } else if (monsterTypes.includes('Xyz')) {
        return '10';
      } else if (monsterTypes.includes('Link')) {
        return '11';
      } else {
        return '01';
      }
    }

    function getIsEffectMonster() {
      const monsterTypes = card.monsterType || [];

      if (monsterTypes.includes('Normal')) {
        return 1;
      } else if (monsterTypes.includes('Effect')) {
        return 2;
      } else {
        return 0;
      }
    }

    function getMonsterLevel() {
      const level = card.level || card.linkRating || 0;
      return level.toString().padStart(2, '0');
    }

    /**
     * Race này là Warrior, Beast, ... nên để sắp xếp theo a-z.
     * @returns Ra
     */
    function getMonsterRace() {
      const monsterRace = card.type === 'Monster' ? card.race || '' : '';
      return monsterRace.padEnd(20, ' ');
    }

    function getMonsterAttribute() {
      const monsterAttribute = card.type === 'Monster' ? card.attribute || '' : '';

      if (!monsterAttribute) {
        return 0;
      } else if (monsterAttribute === 'DARK') {
        return 1;
      } else if (monsterAttribute === 'LIGHT') {
        return 2;
      } else if (monsterAttribute === 'FIRE') {
        return 3;
      } else if (monsterAttribute === 'WATER') {
        return 4;
      } else if (monsterAttribute === 'EARTH') {
        return 5;
      } else if (monsterAttribute === 'WIND') {
        return 6;
      } else {
        return 7;
      }
    }

    /**
     * Race này là Normal, Quick-Play, ...
     */
    function getSpellTrapRace() {
      const race = card.type !== 'Monster' ? card.race || '' : '';

      if (race === 'Normal') {
        return 1;
      } else if (race === 'Quick-Play') {
        return 2;
      } else if (race === 'Ritual') {
        return 3;
      } else if (race === 'Continuous') {
        return 4;
      } else if (race === 'Field') {
        return 5;
      } else if (race === 'Equip') {
        return 6;
      } else if (race === 'Counter') {
        return 7;
      } else {
        return 8;
      }
    }

    function getCardName() {
      const cardName = card.name || '';
      return cardName.padEnd(50, ' ');
    }
  }

  public static initialize(): DefaultSorting {
    const sorting = new DefaultSorting();
    return sorting;
  }
}
