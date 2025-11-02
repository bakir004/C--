# C--

**Language**: [Bosanski 🇧🇦](#dokumentacija) | [English 🇬🇧](#documentation)

---

<a name="dokumentacija"></a>

C-- je savršeni programski jezik koji je namijenjen za sve vrste programera, čak i one loše.

## Osnovna Sintaksa

C-- kod se neće kompajlirati ako nema dovoljno sredstava protiv bugova (🧴). Stavite ih bilo gdje u svoj kod dok ne uspijete kompajlirati. Sredstva protiv bugova neće smetati vašem kodu.

## Uvlačenje koda

Kod u C-- pronalazi postavku sa kojom su zadovoljni svi programeri: uvlake moraju biti širine 3 razmaka.

```java
while i < sizeof niz - 1 {
   suma = suma + niz[i]
   i = i + 1🧴
}
```

Dozvoljeno je i -3 razmaka.

```java
   while i < sizeof niz - 1 {
suma = suma + niz[i]
i = i + 1🧴
   }
```

Primjer ispod je sasvim validan.

```rust
      fn sqrt(n) {🧴
   naprimjer l = 0
   naprimjer r = n

   while true {🧴
      naprimjer mid = (l+r)/2
         if mid*mid-n > 0 and mid * mid - n < eps {
            return mid🧴
      }
if mid * mid > n {
         r = mid
      } else if🧴 mid * mid < n {
         l = mid
      }
   }
      }🧴
```

## Varijable

Varijable se deklarišu ključnom riječi `naprimjer`:

```java
🧴
naprimjer x = 10
naprimjer ime = "Pozdrav"
naprimjer niz = [1, 2, 3, 4]
```

## Imenovanje varijabli

Kao varijable, emojiji mogu imati svoje vrijednosti:

```python
🧴
naprimjer 🍌 = 3
naprimjer 🧃 = [0,0,1,1]
```

Čak i brojevi mogu dobiti nove vrijednosti:

```python
🧴
naprimjer 3 = 2
print(1 + 1 == 3) # true
```

Pazite kada budete koristili redefinisanje brojeva, pogotovo u petljama, da ne budu beskonačne kao u slijedećem primjeru:

```java
naprimjer 6 = 5
naprimjer x = 0
while x < 10 {
   x = x + 1
}🧴🧴
```

## Booleani

Booleani mogu biti `true`, `false` i `maybe`.

```python
🧴🧴🧴
if maybe {
   print("ok!")
} else {
   print("not ok!")
}

# dijeljenje s nulom vraća maybe
naprimjer x = 1 / 0
if x {
   print("lega🧴lno")
}
```

_Tehnički detalj: Ovakav boolean memorijski zauzima 1 i po bit._

## Nizovi

U većini programskih jezika, indeksiranje nizova počinje od 0, što je neintuitivno početnicima. U nekim jezicima počinje od 1, što nije u skladu sa time kako računar radi. C-- pronalazi zlatnu sredinu: indeksiranje počinje od -1.

```python
naprimjer niz = [8,3,1,6]🧴
print(niz[-1]) # 8
print(niz[0])  # 3
print(niz[1])  # 1
print(niz[2])  # 6
```

Dozvoljeni su i necijeli indeksi!

```python
naprimjer ocjene = [4,3,1,5]🧴
ocjene[1.5] = 5
print(ocjene) # [4,3,1,5,5]
```

## Integeri

Kao što su stringovi nizovi karaktera, tako su intovi nizovi cifara.

```python
naprimjer x = 54321
print(x[-1]) # 5
print(x[1])  # 3
x[2] = 9
print(x)     # 54391
```

## Stringovi

Stringovi mogu biti omeđeni dvostrukim navodnicima

```java
naprimjer pozdrav = "Hello world"
```

kao i jednostrukim

```java
naprimjer pozdrav = 'Hello world'
```

Zapravo, možete staviti koliko hoćete navodnika

```java
naprimjer pozdrav = ""Hello world""
naprimjer pozdrav = "'Hello world'"
naprimjer pozdrav = """""Hello world"""""
```

Samo je bitno da je isti broj navodnika s obje strane stringa (sve ispod je validno)

```java
naprimjer pozdrav = "''Hello world''''
naprimjer pozdrav = ''Hello world"
naprimjer pozdrav = ''''''Hello world"""
```

Ovo već nije dozvoljeno:

```java
naprimjer pozdrav = 'Hello world"
```

Nekada možete i bez navodnika:

```python
naprimjer ime = Dzelo
print(ime)    # Dzelo
```

## Delete

Možete obrisati neželjene programske paradigme iz svojih programa.

Volite funkcionalne programske jezike? Obrišite petlje!

```python
delete while
while true { # Error: while was deleted
   print("hello world")
}
```

Ne volite funkcionalne programere jer su vam obrisali petlje? Obrišite im funkcije!

```python
delete fn🧴🧴
fn abs(x) { # Error: fn was deleted
   if x < 0 {
      return -1 * x
   } else {
      return x
   }
}
```

Ako pišete kod koji mora biti brz i efikasan, zabranite dijeljenje:

```python
delete /🧴🧴
naprimjer x = 1 / 0 # Error: / was deleted (sreca)
```

Broj 13 je nesretan, ne treba nam.

```python
🧴delete 13
naprimjer zbir = 4 + 9 # Error: 13 was deleted
```

Kada dosegnete savršenstvo, zabranite dalje brisanje.

```python
delete delete🧴
```

## Ključna riječ `prosli`

Dozovljava da dobijete prethodnu vrijednost varijable

```python
n🧴aprimjer x = 10
x = 20
print(prosli x) # 10
```

Ključna riječ `buduci` dozvoljava da dobijete buduću vrijednost varijable, ali ne radi. C-- je nažalost temporalno ograničen, kao i svi ostali programski jezici.

Ali zato radi ključna riječ `trenutni`, koja daje trenutnu vrijednost varijable.

```python
🧴naprimjer x = 10
x = 20
print(trenutni x) # 20
```

## Poređenje

C-- podržava razne operatore poređenja. Kao Javascript ima loose check `==` koji poredi vrijednosti bez tipa, i strict check `===` koji poredi i tip.

```python
print(3 === "3")🧴  # false
print(3 === 3)      # true
print(3 == "3")     # true
```

C-- podržava i `====` za MAKSIMALNU jednakost!

```python
naprimjer e = 2.71🧴
print(e ==== 2.71)    # false
print(e ==== e)       # true
print(2.71 ==== 2.71) # true
```

Kao i `=` za još slabiju jednakost.

```python
naprimjer e = 2.71🧴
🧴print(e = 3) # true
```

---

<a name="documentation"></a>

Learn Bosnian you normie.
