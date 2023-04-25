Pour les tokens custom qui n'existent pas sur un des CEX compatibles avec l'application, rajouter une classe ayant comme nom le symbole du token avec la première lettre en majuscule.
Y mettre à l'intérieur une fonction getPriceAtDate() qui retourne le prix du token à la date donnée en paramètre.

Exemple:
```typescript
export class Tao {
	getPriceAtDate = (currency: string, atDate: Date) => {
		return 20
	}
}```
