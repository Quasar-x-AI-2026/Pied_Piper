from pydantic import BaseModel, Field
from typing import Optional, Literal
from langchain_core.prompts import ChatPromptTemplate
from langchain_groq import ChatGroq
from datetime import datetime, timedelta

# Extract transaction details
class TransactionExtract(BaseModel):
    """Schema for extracting transaction details from chat"""
    amount: float = Field(..., description="Transaction amount in INR")
    category: Optional[str] = Field(None, description="Expense category: food, transport, entertainment, shopping, bills, health, education, other")
    description: str = Field(..., description="Brief description of transaction")
    type: Literal["expense", "income"] = Field("expense", description="Transaction type")
    payment_mode: Optional[str] = Field(None, description="Payment method: cash, upi, card, netbanking")
    date: Optional[str] = Field(None, description="Transaction date if mentioned, format: YYYY-MM-DD")


llm = ChatGroq(model="llama-3.1-8b-instant", temperature=0)


transaction_prompt = ChatPromptTemplate.from_messages([
    ("system", """
You are a financial transaction parser. Extract transaction details from user messages in ENGLISH, HINDI, and HINGLISH.

RULES:
- Amount is MANDATORY
- Understand natural language in multiple languages
- Infer category from context using these mappings:
  
  * FOOD: tea, coffee, chai, lunch, dinner, breakfast, snacks, restaurant, food, meal, pizza, burger, 
          khana, nashta, khana, roti, dal, sabzi, mithai, samosa, paratha, dosa, idli
  
  * TRANSPORT: auto, taxi, uber, ola, bus, train, metro, petrol, diesel, fuel, cab, rickshaw, 
               gaadi, riksha, rikshaw, auto-rickshaw
  
  * SHOPPING: clothes, shirt, shoes, dress, shopping, mall, online shopping, amazon, flipkart, 
              kapde, joote, saman, chize, kapda
  
  * ENTERTAINMENT: movie, cinema, netflix, game, gaming, concert, party, film, picture, 
                   mazaa, masti, entertainment
  
  * BILLS: electricity, water, rent, internet, wifi, phone bill, recharge, 
           bijli, pani, kiraya, bill, recharge
  
  * HEALTH: doctor, medicine, hospital, clinic, pharmacy, medical, 
            doctor, davai, dawai, dawa, aspatal, hospital
  
  * EDUCATION: book, course, tuition, fees, school, college, 
               padhai, kitab, pustak, siksha, shiksha
  
  * OTHER: anything else

- Default type is "expense" unless income keywords like:
  * INCOME: salary, received, credited, mila, aaya, income, kamaya, mili

- **IMPORTANT**: For date field:
  * If user mentions specific date → extract it
  * Recognized date keywords:
    - TODAY: aaj, today, aj
    - YESTERDAY: kal, yesterday, kaal
    - DAY BEFORE: parso, parson, day before yesterday
    - Specific dates: "15th", "20th January", "last Monday"
  * If NO date mentioned → return null (NOT today's date)
  * Let the backend handle default date assignment

- Be smart with natural language and code-mixed Hinglish

**HINGLISH KEYWORDS TO RECOGNIZE:**

MONEY TERMS:
- paise, rupaye, rupees, rs, rupaiya, paisa

SPENDING VERBS:
- kharch kiya, kharcha, spent, spend kiya, pay kiya, diya, diye, de diye, 
  laga diye, lag gaye, kharcha hua

BUYING VERBS:
- kharida, liya, bought, le liya, kharid liya, manga liya

PREPOSITIONS:
- ke liye (for), par (on), pe (on), mein (in), se (from/with)

CONJUNCTIONS:
- aur (and), ya (or)

TIME REFERENCES:
- aaj (today), kal (yesterday), parso (day before), abhi (now)

COMMON PHRASES:
- "X rupaye ka/ki" = X rupees for/of
- "X pe Y kharch" = spent Y on X
- "X ke liye Y diye" = paid Y for X
- "X ka bill" = bill of X
- "X mein Y laga" = spent Y on X

Examples:
ENGLISH:
"Spent 50 rupees on tea" → amount: 50, category: food, description: tea, date: null
"Auto fare 30" → amount: 30, category: transport, description: auto fare, date: null
"Bought shirt for 800 yesterday" → amount: 800, category: shopping, description: shirt, date: <yesterday>
"Got salary 25000" → amount: 25000, type: income, description: salary, date: null
"Paid 200 for lunch on 20th" → amount: 200, category: food, description: lunch, date: "2025-01-20"

HINGLISH:
"50 rupaye chai pe kharch kiye" → amount: 50, category: food, description: chai, date: null
"Chai pe 50 rs lag gaye" → amount: 50, category: food, description: chai, date: null
"Auto ka 30 rupaye diye" → amount: 30, category: transport, description: auto, date: null
"30 rupees auto mein laga" → amount: 30, category: transport, description: auto, date: null
"Kal 800 ka shirt liya" → amount: 800, category: shopping, description: shirt, date: <yesterday>
"800 rupaye shirt khariida kal" → amount: 800, category: shopping, description: shirt, date: <yesterday>
"25000 salary mili" → amount: 25000, type: income, description: salary, date: null
"Aaj 25000 ka salary aaya" → amount: 25000, type: income, description: salary, date: <today>
"200 rupaye lunch ke liye diye aaj" → amount: 200, category: food, description: lunch, date: <today>
"Lunch pe 200 kharch kiya" → amount: 200, category: food, description: lunch, date: null
"Tea pe 20 spent kiya" → amount: 20, category: food, description: tea, date: null
"Metro mein 40 rupaye kharch" → amount: 40, category: transport, description: metro, date: null
"Movie ke liye 300 diye" → amount: 300, category: entertainment, description: movie, date: null
"Doctor ko 500 pay kiye kal" → amount: 500, category: health, description: doctor, date: <yesterday>
"Parso 1000 ki dawai li" → amount: 1000, category: health, description: medicine, date: <day before yesterday>
"Bijli ka bill 2000 bhara" → amount: 2000, category: bills, description: electricity bill, date: null
"Netflix ka recharge 500" → amount: 500, category: entertainment, description: Netflix recharge, date: null
"Kitab ke liye 250 diye" → amount: 250, category: education, description: book, date: null

NATURAL HINGLISH:
"Aaj subah 50 ka paratha khaya" → amount: 50, category: food, description: paratha, date: <today>
"Kal raat movie dekhi 300 ki" → amount: 300, category: entertainment, description: movie, date: <yesterday>
"Office jane ke liye metro mein 40" → amount: 40, category: transport, description: metro, date: null
"Kapde kharide 1500 ke" → amount: 1500, category: shopping, description: clothes, date: null
"""),
    ("human", "{user_message}")
])


def parse_hinglish_date(text: str) -> Optional[str]:
    """
    Parse Hinglish date references
    
    Args:
        text: User message text
        
    Returns:
        ISO format date string or None
    """
    text_lower = text.lower()
    today = datetime.now()
    
    # Today
    if any(word in text_lower for word in ['aaj', 'aj', 'today']):
        return today.strftime("%Y-%m-%d")
    
    # Yesterday
    if any(word in text_lower for word in ['kal', 'kaal', 'yesterday']):
        yesterday = today - timedelta(days=1)
        return yesterday.strftime("%Y-%m-%d")
    
    # Day before yesterday
    if any(word in text_lower for word in ['parso', 'parson', 'day before yesterday']):
        day_before = today - timedelta(days=2)
        return day_before.strftime("%Y-%m-%d")
    
    return None


def parse_transaction(user_message: str) -> Optional[TransactionExtract]:
    """
    Parse transaction from natural language (English + Hinglish).
    
    Args:
        user_message: User's natural language transaction description
        
    Returns:
        TransactionExtract object or None if parsing fails
    """
    chain = transaction_prompt | llm.with_structured_output(TransactionExtract)
    
    try:
        # First, try to extract date using Hinglish parser
        hinglish_date = parse_hinglish_date(user_message)
        
        # Parse transaction
        transaction = chain.invoke({"user_message": user_message})
        
        # If LLM didn't extract date but we found Hinglish date reference
        if not transaction.date and hinglish_date:
            transaction.date = hinglish_date
            print(f"[TransactionParser] ✅ Hinglish date detected: {transaction.date}")
        
        # If still no date, use today as default
        if not transaction.date:
            transaction.date = datetime.now().strftime("%Y-%m-%d")
            print(f"[TransactionParser] ⚠️ No date in query, using today: {transaction.date}")
        
        # Log parsed details
        print(f"[TransactionParser] ✅ Parsed transaction:")
        print(f"  Amount: ₹{transaction.amount}")
        print(f"  Category: {transaction.category}")
        print(f"  Description: {transaction.description}")
        print(f"  Type: {transaction.type}")
        print(f"  Date: {transaction.date}")
        
        # Validate amount is positive
        if transaction.amount <= 0:
            print(f"[TransactionParser] ❌ Invalid amount: {transaction.amount}")
            return None
        
        return transaction
        
    except Exception as e:
        print(f"[TransactionParser] ❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return None


def test_hinglish_parser():
    """Test function for Hinglish transaction parsing"""
    test_cases = [
        "50 rupaye chai pe kharch kiye",
        "Auto ka 30 rupaye diye",
        "Kal 800 ka shirt liya",
        "25000 salary mili",
        "200 rupaye lunch ke liye diye aaj",
        "Tea pe 20 spent kiya",
        "Metro mein 40 rupaye kharch",
        "Movie ke liye 300 diye",
        "Doctor ko 500 pay kiye kal",
        "Parso 1000 ki dawai li",
        "Bijli ka bill 2000 bhara",
        "Aaj subah 50 ka paratha khaya",
        "Office jane ke liye metro mein 40"
    ]
    
    print("\n" + "="*60)
    print("HINGLISH TRANSACTION PARSER TEST")
    print("="*60 + "\n")
    
    for test in test_cases:
        print(f"Input: {test}")
        result = parse_transaction(test)
        if result:
            print(f"✅ Parsed successfully")
            print(f"   Amount: ₹{result.amount}")
            print(f"   Category: {result.category}")
            print(f"   Description: {result.description}")
            print(f"   Date: {result.date}")
        else:
            print(f"❌ Failed to parse")
        print("-" * 60 + "\n")


if __name__ == "__main__":
    # Run tests
    test_hinglish_parser()