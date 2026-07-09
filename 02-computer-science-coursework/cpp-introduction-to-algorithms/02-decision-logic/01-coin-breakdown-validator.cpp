#include <iostream>

using namespace std;

int main() {
    int m5, m2, m1;
    int dinero;
    cout << "Ingresa el dinero a desglosar: ";
    cin >> dinero;
    m5 = dinero / 5;
    m2 = dinero % 5 / 2;
    m1 = dinero % 2;

    cout << "Monedas de 5 soles: " << m5;
    cout << "\nMonedas de 2 soles: " << m2;
    cout << "\nMonedas de 1 sol: " << m1;

    return 0;
}
