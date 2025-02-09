# Firestore Query for Highest Potential Users with Pagination

## **Problem Statement**
We need to structure a Firestore query to retrieve the highest potential users from the **USERS** collection. The ranking is based on:

1. **Total Average Weighted Ratings** (Higher is better)
2. **Number of Rents** (Higher is better)
3. **Recent Activity** (Higher is better, epoch time)

The query should support **pagination** to efficiently fetch users in order.

---

## **Mathematical Approach**
Each user \( i \) has:

- \( R_i \) = `totalAverageWeightRatings`
- \( N_i \) = `numberOfRents`
- \( T_i \) = `recentlyActive` (epoch time)

Sorting priority:

\[ \max \{ R_i \} \to \max \{ N_i \} \to \max \{ T_i \} \]

This ensures:
1. Highest-rated users appear first.
2. Among users with the same rating, those with more rentals appear first.
3. Among users with the same rating and rentals, the most recently active users appear first.

---

## **Firestore Query**
Firestore supports **compound ordering** with indexes. The query structure:

```ts
const query = db.collection("USERS")
  .orderBy("totalAverageWeightRatings", "desc") // Highest rating first
  .orderBy("numberOfRents", "desc") // Most rentals second
  .orderBy("recentlyActive", "desc") // Most recent last
  .limit(10); // Fetch top 10 users
```

This query retrieves the first 10 users sorted based on the given criteria.

---

## **Pagination Using Cursors**
To fetch the next set of users, use **cursors** with the `startAfter` method:

```ts
const nextQuery = db.collection("USERS")
  .orderBy("totalAverageWeightRatings", "desc")
  .orderBy("numberOfRents", "desc")
  .orderBy("recentlyActive", "desc")
  .startAfter(lastDoc) // lastDoc is the last document from the previous page
  .limit(10);
```

Where:
- `lastDoc` is the last document retrieved from the previous query.
- `startAfter(lastDoc)` ensures efficient pagination.

---

## **Indexing Requirement**
Firestore requires a **composite index** for multiple `orderBy` clauses:

```
totalAverageWeightRatings (DESC), numberOfRents (DESC), recentlyActive (DESC)
```

To create this index:
1. Open **Firebase Console**.
2. Navigate to **Firestore Database** → **Indexes**.
3. Add a **Composite Index** with:
    - `totalAverageWeightRatings` (Descending)
    - `numberOfRents` (Descending)
    - `recentlyActive` (Descending)
4. Click **Create Index**.

---

## **Time Complexity Analysis**
Firestore queries operate on indexed data, making them **highly efficient**:

\[ O(\log M + k) \]

Where:
- \( O(\log M) \) is the lookup time for indexed sorting.
- \( O(k) \) is the time taken to fetch `k` results.

With **pagination**, fetching the next page is **O(1)** using `startAfter(lastDoc)`.

---

## **Expected Query Result Order**
Given the following data:

```json
{
  "User A": { "totalAverageWeightRatings": 4.3, "numberOfRents": 30, "recentlyActive": 1738938812 },
  "User B": { "totalAverageWeightRatings": 4.3, "numberOfRents": 30, "recentlyActive": 1738679612 },
  "User C": { "totalAverageWeightRatings": 4.3, "numberOfRents": 28, "recentlyActive": 1738679612 }
}
```

The query correctly returns:

1. **User A** (Highest rating → Most rentals → Most recent)
2. **User B** (Same rating & rentals but less recent)
3. **User C** (Lower rentals, even with same rating)

---

## **Conclusion**
This approach ensures:
- **Correct Sorting**: Users are retrieved in the required order.
- **Fast Query Execution**: Utilizes Firestore's **indexed search**.
- **Efficient Pagination**: Uses `startAfter(lastDoc)` to fetch results dynamically.


