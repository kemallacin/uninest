import json
from datetime import datetime
import os

BOOKS_FILE = 'books.json'
MEMBERS_FILE = 'members.json'
TRANSACTIONS_FILE = 'transactions.json'


class Book:
    def __init__(self, title, author, year, book_id=None, available=True):
        self.id = book_id
        self.title = title
        self.author = author
        self.year = year
        self.available = available

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'author': self.author,
            'year': self.year,
            'available': self.available
        }


class Member:
    def __init__(self, name, email, member_id=None):
        self.id = member_id
        self.name = name
        self.email = email

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email
        }


class Transaction:
    def __init__(self, book_id, member_id, checkout_date, return_date=None):
        self.book_id = book_id
        self.member_id = member_id
        self.checkout_date = checkout_date
        self.return_date = return_date

    def to_dict(self):
        return {
            'book_id': self.book_id,
            'member_id': self.member_id,
            'checkout_date': self.checkout_date,
            'return_date': self.return_date
        }

class Library:
    def __init__(self):
        self.books = self._load_data(BOOKS_FILE)
        self.members = self._load_data(MEMBERS_FILE)
        self.transactions = self._load_data(TRANSACTIONS_FILE)

        self.next_book_id = self._get_next_id(self.books)
        self.next_member_id = self._get_next_id(self.members)

        print("Library system is starting up.")

    @staticmethod
    def _load_data(filename):
        if os.path.exists(filename) and os.path.getsize(filename) > 0:
            with open(filename, 'r') as f:
                try:
                    return json.load(f)
                except json.JSONDecodeError:
                    return []
        return []

    def _save_data(self):
        with open(BOOKS_FILE, 'w') as f:
            json.dump(self.books, f)
        with open(MEMBERS_FILE, 'w') as f:
            json.dump(self.members, f)
        with open(TRANSACTIONS_FILE, 'w') as f:
            json.dump(self.transactions, f)

    @staticmethod
    def _get_next_id(data_list):
        if not data_list:
            return 1
        return max(item['id'] for item in data_list) + 1

    def add_book(self, book):
        book.id = self.next_book_id
        self.books.append(book.to_dict())
        self.next_book_id += 1

        self._save_data()
        print(f"Book has been successfully added.. ID: {book.id}")

    def add_member(self, member):
        if '@' not in member.email or '.' not in member.email:
            print("Error: Invalid email format.")
            return
        for existing_member in self.members:
            if existing_member['email'] == member.email:
                print("Error: E-mail already exists.")
                return

        member.id = self.next_member_id
        self.members.append(member.to_dict())
        self.next_member_id += 1

        self._save_data()
        print(f"Member has been successfully added. ID: {member.id}")

    def search_book(self, keyword):
        keyword_lower = keyword.lower()
        results = []

        for book in self.books:
            if (keyword_lower in book['title'].lower() or
                    keyword_lower in book['author'].lower()):
                results.append(book)

        if results:
            print("\nFound books:")
            for book in results:
                availability = "Available" if book['available'] else "Borrowed"
                print(f"ID: {book['id']} | Book Name: {book['title']} | Author: {book['author']} | Year: {book['year']} | Status: {availability}")
        else:
            print("Book not found.")

    def borrow_book(self, book_id, member_id):
        book_to_borrow = None
        for book in self.books:
            if book['id'] == book_id:
                book_to_borrow = book
                break

        member_exists = any(member['id'] == member_id for member in self.members)

        if not book_to_borrow:
            print("Error: Book ID not found.")
            return
        if not member_exists:
            print("Error: Member ID not found.")
            return
        if not book_to_borrow['available']:
            print("Error: Book is not currently available.")
            return

        book_to_borrow['available'] = False
        checkout_date = datetime.now().strftime('%Y-%m-%d %H:%M')
        new_transaction = Transaction(book_id, member_id, checkout_date).to_dict()
        self.transactions.append(new_transaction)

        self._save_data()
        print("Book has been successfully borrowed.")

    def return_book(self, book_id):
        book_to_return = None
        for book in self.books:
            if book['id'] == book_id:
                book_to_return = book
                break

        if not book_to_return:
            print("Error: Book ID not found.")
            return

        active_transaction = None
        for transaction in reversed(self.transactions):
            if transaction['book_id'] == book_id and transaction['return_date'] is None:
                active_transaction = transaction
                break

        if not active_transaction:
            print("No active borrowing record was found for this book.")
            return

        return_date = datetime.now().strftime('%Y-%m-%d %H:%M')
        active_transaction['return_date'] = return_date
        book_to_return['available'] = True

        self._save_data()
        print("Book has been successfully returned.")

    def view_borrowed_books(self):
        borrowed_list = []
        for t in self.transactions:
            if t['return_date'] is None:
                borrowed_list.append(t)

        if not borrowed_list:
            print("There are no borrowed books.")
            return

        print("\n**Borrowed Books**")
        for transaction in borrowed_list:
            book_title = "Unknown"
            for b in self.books:
                if b['id'] == transaction['book_id']:
                    book_title = b['title']
                    break

            member_name = "Unknown"
            member_email = "Unknown"
            for m in self.members:
                if m['id'] == transaction['member_id']:
                    member_name = m['name']
                    member_email = m['email']
                    break

            print(f"Book: {book_title} | Member: {member_name} | E-mail: {member_email} | Date: {transaction['checkout_date']}")

    def close(self):
        self._save_data()
        print("Data has been saved. The library system is shutting down.")


def main():
    library = Library()

    while True:
        print("\n--- 📖 Library Management System ---")
        print("1. Add a Book")
        print("2. Add a Member")
        print("3. Search for a Book")
        print("4. Borrow a Book")
        print("5. Return a Book")
        print("6. View Borrowed Books")
        print("7. Exit")
        choice = input("Enter your choice: ")

        if choice == '1':
            title = input("Book Name: ")
            author = input("Author: ")
            try:
                year = int(input("Year: "))
            except ValueError:
                print("Error: The year must be a valid number.")
                continue
            book = Book(title, author, year)
            library.add_book(book)

        elif choice == '2':
            name = input("Name and Surname: ")
            email = input("E-mail: ")
            member = Member(name, email)
            library.add_member(member)

        elif choice == '3':
            keyword = input("Search Keyword (Book Name or Author): ")
            library.search_book(keyword)

        elif choice == '4':
            try:
                book_id = int(input("Book ID: "))
                member_id = int(input("Member ID: "))
            except ValueError:
                print("Error: IDs must be valid numbers.")
                continue
            library.borrow_book(book_id, member_id)

        elif choice == '5':
            try:
                book_id = int(input("Book ID to be returned: "))
            except ValueError:
                print("Error: The Book ID must be a valid number.")
                continue
            library.return_book(book_id)

        elif choice == '6':
            library.view_borrowed_books()

        elif choice == '7':
            library.close()
            break

        else:
            print("İnvalid Choice.")


if __name__ == "__main__":
    main()