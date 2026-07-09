#include <iostream>

using namespace std;

int Mayor(int A, int B) {
    int Max = (A > B) ? A : B;
    return Max;
}

int main() {
    int A, B;
    cout << "Ingrese los numeros a comparar:\n";
    cin >> A >> B;
    int Max = Mayor(A, B);
    cout << "El mayor de los numeros " << A << " y " << B << " es: " << Max;

    return 0;
}
