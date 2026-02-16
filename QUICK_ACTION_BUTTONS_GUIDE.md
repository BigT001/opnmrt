# BigT Quick Action Buttons - Implementation Guide

## Overview
This feature adds clickable action buttons to BigT's responses, making recommendations instantly actionable.

---

## How It Works

### **1. Smart Content Parsing**
BigT's responses are analyzed for action-triggering keywords:

| Keyword Pattern | Action Button | Destination |
|----------------|---------------|-------------|
| "out of stock" / "running low" | **View Inventory** | `/dashboard/seller/inventory` |
| "restock" / "stock up" | **Manage Products** | `/dashboard/seller/products` |
| "pending order" | **View Orders** | `/dashboard/seller/orders` |
| "marketing" / "promote" | **Marketing Ideas** | Asks BigT for quick wins |
| "new product added" | **View Products** | `/dashboard/seller/products` |
| "sales dropped" | **View Analytics** | `/dashboard/seller/analytics` |
| "customer" / "review" | **View Customers** | `/dashboard/seller/customers` |

---

## Implementation Code

### **Step 1: Add MessageWithActions Component**

Add this component to `apps/web/src/app/dashboard/seller/analytics/page.tsx` after the `AdviceCard` component:

```tsx
const MessageWithActions = ({ content, onQuickAction }: { content: string; onQuickAction?: (msg: string) => void }) => {
    const router = useRouter();
    
    // Extract action buttons from content
    const parseActions = (text: string) => {
        const actions: Array<{ label: string; action: string; link?: string }> = [];
        const lower = text.toLowerCase();
        
        // Inventory actions
        if (lower.includes('out of stock') || lower.includes('running low')) {
            actions.push({ label: '📦 View Inventory', action: 'navigate', link: '/dashboard/seller/inventory' });
        }
        if (lower.includes('restock') || lower.includes('stock up')) {
            actions.push({ label: '➕ Manage Products', action: 'navigate', link: '/dashboard/seller/products' });
        }
        
        // Order actions
        if (lower.includes('order') && lower.includes('pending')) {
            actions.push({ label: '🛍️ View Orders', action: 'navigate', link: '/dashboard/seller/orders' });
        }
        
        // Marketing actions
        if (lower.includes('marketing') || lower.includes('promote') || lower.includes('advertise')) {
            actions.push({ label: '🎯 Marketing Ideas', action: 'ask', link: 'Give me 3 quick marketing wins for my store' });
        }
        
        // Product actions
        if (lower.includes('new product') && lower.includes('added')) {
            actions.push({ label: '👀 View Products', action: 'navigate', link: '/dashboard/seller/products' });
        }
        
        // Sales actions
        if (lower.includes('sales dropped') || lower.includes('sales down')) {
            actions.push({ label: '📊 View Analytics', action: 'navigate', link: '/dashboard/seller/analytics' });
            actions.push({ label: '💡 Get Recovery Plan', action: 'ask', link: 'How can I recover from this sales drop?' });
        }
        
        return actions;
    };
    
    const actions = parseActions(content);
    
    const handleAction = (action: { label: string; action: string; link?: string }) => {
        if (action.action === 'navigate' && action.link) {
            router.push(action.link);
        } else if (action.action === 'ask' && action.link && onQuickAction) {
            onQuickAction(action.link);
        }
    };
    
    return (
        <div className="space-y-3">
            <div className="whitespace-pre-wrap">{content}</div>
            {actions.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-3 border-t border-slate-100 mt-3">
                    {actions.map((action, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleAction(action)}
                            className="px-4 py-2 bg-slate-100 hover:bg-indigo-600 hover:text-white text-slate-700 rounded-xl text-[11px] font-bold transition-all shadow-sm hover:shadow-md flex items-center gap-2 group"
                        >
                            {action.label}
                            <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};
```

---

### **Step 2: Update Message Rendering**

Replace the message content rendering (around line 316) with:

```tsx
<div className={`text-[14px] leading-relaxed font-medium ${msg.role === 'user'
    ? 'bg-indigo-600 text-white p-5 rounded-[2rem] rounded-tr-none shadow-xl shadow-indigo-100'
    : 'text-slate-800 pt-2'
    }`}>
    {msg.role === 'assistant' ? (
        <MessageWithActions 
            content={msg.content} 
            onQuickAction={(message) => {
                setInput(message);
                // Auto-submit or let user review
                // handleSendMessage(new Event('submit') as any);
            }}
        />
    ) : (
        <span className="whitespace-pre-wrap">{msg.content}</span>
    )}
</div>
```

---

### **Step 3: Add useRouter Import**

At the top of the file, add:

```tsx
import { useRouter } from 'next/navigation';
```

Then in the main component:

```tsx
export default function AnalyticsPage() {
    const router = useRouter();
    const { store, user } = useAuthStore();
    // ... rest of code
}
```

---

## Example Interactions

### **Example 1: Low Stock Alert**

**BigT:** "Angel is running low with only 3 units left. At your current sales velocity (4 units/week), you'll stock out in 5 days."

**Action Buttons:**
- [📦 View Inventory]
- [➕ Manage Products]

---

### **Example 2: Sales Drop**

**BigT:** "Sales dropped 40% this week compared to last week. Your top product 'Angel' is underperforming."

**Action Buttons:**
- [📊 View Analytics]
- [💡 Get Recovery Plan]

---

### **Example 3: New Product**

**BigT:** "🎉 I see you just added 'Premium Wallet' with 15 units! Here's my launch strategy..."

**Action Buttons:**
- [👀 View Products]
- [🎯 Marketing Ideas]

---

### **Example 4: Pending Orders**

**BigT:** "You have 3 pending orders totaling ₦45,000 waiting for fulfillment."

**Action Buttons:**
- [🛍️ View Orders]

---

## Advanced Features (Future)

### **1. Smart Button Prioritization**
- Show max 3 buttons per message
- Prioritize based on urgency (out of stock > low stock > marketing)

### **2. Contextual Actions**
- "Restock Angel" → Pre-fill product name in inventory form
- "Email customers" → Open email composer with template

### **3. One-Click Actions**
- "Mark all orders as shipped" → Bulk action
- "Create flash sale" → Auto-generate 20% off campaign

### **4. Action History**
- Track which buttons users click most
- Optimize button suggestions based on usage

---

## Benefits

### **User Experience:**
- ✅ **Reduces clicks** - Direct navigation from advice to action
- ✅ **Increases engagement** - Makes BigT feel more interactive
- ✅ **Improves conversion** - Users act on advice immediately
- ✅ **Saves time** - No need to remember where to go

### **Business Impact:**
- ✅ **Higher feature adoption** - Users discover inventory/orders pages
- ✅ **Faster problem resolution** - Out-of-stock issues fixed quicker
- ✅ **Better data** - Track which recommendations drive action
- ✅ **Competitive advantage** - Unique AI-powered UX

---

## Testing Checklist

- [ ] Buttons appear for low stock messages
- [ ] Buttons navigate to correct pages
- [ ] "Ask" buttons populate input field
- [ ] Buttons have hover effects
- [ ] Mobile responsive (buttons wrap properly)
- [ ] No duplicate buttons for same action
- [ ] Buttons don't appear for user messages
- [ ] Router navigation works correctly

---

## Metrics to Track

Once implemented, monitor:

1. **Button Click Rate** - % of messages with buttons that get clicked
2. **Action Completion** - Do users complete the suggested action?
3. **Time to Action** - How fast do users act after BigT's suggestion?
4. **Most Clicked Actions** - Which buttons are most valuable?

---

## Next Enhancement: Voice of Customer

After Quick Action Buttons, the next high-impact feature is **Voice of Customer Analysis**:

- Analyze order notes for customer requests
- Extract common themes ("gift wrapping", "faster shipping")
- Suggest new services/products based on demand
- Alert when multiple customers ask for the same thing

**Implementation time:** 20 minutes  
**Impact:** Uncovers hidden revenue opportunities

---

**Status:** Ready for implementation  
**Estimated Time:** 15-20 minutes  
**Complexity:** Low  
**Impact:** High (immediate UX improvement)
