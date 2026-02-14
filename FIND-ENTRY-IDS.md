# 🔍 FINDING CORRECT GOOGLE FORM ENTRY IDs

## Problem:
Form data is not saving to Google Sheets because the entry field IDs might be incorrect.

## Solution: Find the Correct Entry IDs

### Method 1: Using Browser Console (EASIEST) ⭐

1. **Open your Google Form:**
   - Go to: https://docs.google.com/forms/d/e/1FAIpQLSdUoXyun_N1BYtlAD2HZyGX2tLtTO0LIaayOEqWq3GgqoCAnQ/viewform

2. **Open Browser Developer Tools:**
   - Press `F12` on your keyboard
   - OR Right-click anywhere → Select "Inspect" or "Inspect Element"

3. **Go to Console Tab:**
   - Click on the "Console" tab in Developer Tools

4. **Copy and Paste This Code:**
   ```javascript
   // Find all entry fields in the Google Form
   const inputs = document.querySelectorAll('input[name^="entry"], textarea[name^="entry"], select[name^="entry"]');
   const fields = [];
   
   inputs.forEach(input => {
       // Try to find the question label
       let label = 'Unknown Field';
       
       // Method 1: Look for aria-label
       if (input.getAttribute('aria-label')) {
           label = input.getAttribute('aria-label');
       }
       // Method 2: Look for nearby heading
       else {
           const container = input.closest('div[role="listitem"]') || input.closest('.freebirdFormviewerComponentsQuestionBaseRoot');
           if (container) {
               const heading = container.querySelector('[role="heading"]') || 
                              container.querySelector('.freebirdFormviewerComponentsQuestionBaseTitle');
               if (heading) {
                   label = heading.textContent.trim();
               }
           }
       }
       
       fields.push({
           'Question': label,
           'Entry ID': input.name,
           'Type': input.type || input.tagName.toLowerCase()
       });
   });
   
   console.table(fields);
   console.log('\n📋 COPY THIS AND SEND TO DEVELOPER:');
   fields.forEach(f => console.log(`${f.Question}: ${f['Entry ID']}`));
   ```

5. **Press Enter** - You'll see a table with all entry IDs!

6. **Copy the Results** - It will show something like:
   ```
   Untitled Question: entry.123456789
   DATE: entry.987654321
   Pickup: entry.456789123
   Drop: entry.789123456
   Pckup Time: entry.321654987
   Mobile NO: entry.654987321
   CAR TYPE: entry.147258369
   ```

---

### Method 2: View Page Source (ALTERNATIVE)

1. **Open your Google Form:**
   - https://docs.google.com/forms/d/e/1FAIpQLSdUoXyun_N1BYtlAD2HZyGX2tLtTO0LIaayOEqWq3GgqoCAnQ/viewform

2. **View Page Source:**
   - Press `Ctrl + U` on your keyboard
   - OR Right-click → "View Page Source"

3. **Search for Entry IDs:**
   - Press `Ctrl + F` to open search
   - Type: `entry.`
   - Look for patterns like: `name="entry.123456789"`

4. **Match each field name** with its entry ID by looking at nearby text

---

### Method 3: Pre-fill Link Method (MANUAL)

1. **Open your Google Form**
2. **Fill in EACH field** with unique test values:
   ```
   Trip Type: One Way Trip
   Date: 2026-02-14
   Pickup: Test Pickup
   Drop: Test Drop
   Time: 10:30
   Mobile: 9999999999
   Car Type: Sedan
   ```

3. **Click the three dots** (⋮) at the top-right of the form
4. **Select "Get pre-filled link"**
5. **Click "Get link"**
6. **The URL will contain all entry IDs!** Example:
   ```
   https://docs.google.com/forms/.../viewform?
   entry.123456789=One+Way+Trip&
   entry.987654321=2026-02-14&
   entry.456789123=Test+Pickup&
   entry.789123456=Test+Drop&
   entry.321654987=10:30&
   entry.654987321=9999999999&
   entry.147258369=Sedan
   ```

7. **Match the values** to find which entry ID belongs to which field

---

## 📝 Current Entry IDs in Code (Need Verification):

```javascript
entry.219265158 → Trip Type
entry.1594636824 → Pickup Date
entry.1069431231 → Pickup Location
entry.1297259824 → Drop Location
entry.2064504236 → Pickup Time
entry.1057979598 → Mobile Number
entry.681528332 → Car Type
```

---

## ✅ What to Do After Finding Correct Entry IDs:

**Send me the correct mapping in this format:**

```
Trip Type (Untitled Question): entry.XXXXXX
Date (DATE): entry.XXXXXX
Pickup Location (Pickup): entry.XXXXXX
Drop Location (Drop): entry.XXXXXX
Pickup Time (Pckup Time): entry.XXXXXX
Mobile Number (Mobile NO): entry.XXXXXX
Car Type (CAR TYPE): entry.XXXXXX
```

**I will then update the code with the correct entry IDs!**

---

## 🧪 Testing After Fix:

1. Fill the booking form on your website
2. Press `F12` → Go to Console tab
3. Submit the form
4. Check console logs - you'll see what data is being sent
5. Check your Google Sheets - data should appear!

---

## 📞 Need Help?

If you're stuck, just:
1. Take a screenshot of the console output
2. Send me the entry IDs you found
3. I'll update the code immediately!
