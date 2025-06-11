import java.util.Scanner;

public class BankingApp {
    public static void main(String[] args) {
        BankAccount obj1 = new BankAccount("clloyd", "CL0114");
        obj1.showMenu();
    }
}

class BankAccount {
    int balance;
    int previousTransaction;
    String customerName;
    String customerId;

    BankAccount(String cname, String cid) {
        customerName = cname;
        customerId = cid;
    }

    void deposit(int amount) {
        if (amount > 0) {
            balance = balance + amount;
            previousTransaction = amount;
        }
    }

    void withdraw(int amount) {
        if (amount > balance) {
            System.out.println("You can't withdraw as " + amount + "" + "exceeds balance" + "" + balance);
        } else {
            if (amount != 0) {
                        balance = balance - amount;
                        previousTransaction = amount;
                }
        } 
    }

    void getPreviousTransaction() {
        if (previousTransaction > 0) {
            System.out.println("Deposited" + previousTransaction);
        } else if (previousTransaction < 0) {
            System.out.println("Withdrawn: " + Math.abs(previousTransaction));
        } else {
            System.out.println("No transaction occurred");
        }
    }

    void showMenu() {
        char option = '\0';
        char uppercaseOption = '\0';

        try (Scanner menuOption = new Scanner(System.in)) {
            System.out.println("Welcome" + customerName);
            System.out.println("Your ID is:" + customerId);
            System.out.println("\n");
            System.out.println("A: Check Balance");
            System.out.println("B: Deposit");
            System.out.println("C: Withdraw");
            System.out.println("D: Previous Transaction");
            System.out.println("Exit");

            do {
                System.out.println("===================================================");
                System.out.println("Enter an option");
                System.out.println("===================================================");
                option = menuOption.next().charAt(0);
                uppercaseOption = Character.toUpperCase(option);
                System.out.println("\n");

                switch (uppercaseOption) {
                    case 'A':
                        System.out.println("===================================================");
                        System.out.println("Balance:" + balance);
                        System.out.println("===================================================");
                        System.out.println("\n");
                        break;
                    case 'B':
                        System.out.println("===================================================");
                        System.out.println("How much would you like to deposit?");
                        System.out.println("===================================================");
                        int amount = '\0';
                        Scanner depositAmount = new Scanner(System.in);
                        amount = depositAmount.nextInt();
                        deposit(amount);
                        System.out.println("\n");
                        break;
                    case 'C':
                        System.out.println("===================================================");
                        System.out.println("How much would you like to withdraw?");
                        System.out.println("===================================================");
                        int amount2 = '\0';
                        Scanner withdrawAmount = new Scanner(System.in);
                        amount2 = withdrawAmount.nextInt();
                        withdraw(amount2);
                        System.out.println("\n");
                        break;
                    case 'D':
                        System.out.println("===================================================");
                        getPreviousTransaction();
                        System.out.println("===================================================");
                        System.out.println("\n");
                        break;
                    case 'E':
                        System.out.println("Invalid option!! Please Enter again");
                        break;
                
                    default:
                        System.out.println("Invalid option, please enter A,B,C,D");
                        break;
                } 
   }while(uppercaseOption != 'E');
        }
        
        System.out.println("Thank you for using our services!");

    }

}