; pircontrol4.asm			Steinau, 12.10.2018
; ###########################################################
; IR-Bewegungsmelder-Ueberwachung mit PIC im Sleepmodus und
; einschalten eines Raspi (+5V) ueber GP5 per P-Ch-Mosfet.
; 1. Ausbau-Stufe: Test Sleep, mit LED an GP5 / Ergebnis:
; Wenn man mit High an GP2 tippt, leuchtet LED ca. 2 Sek.
; Ergebnis: 				       ok. 07.08.18
; 2. Ausbaustufe: Test PIR mit Pin OUT an GP2 / Ergebnis:
; Der PIR hat eine minimale EIN-Zeit von ca. 4-5 Sek., bevor
; diese nicht abgelaufen ist, läßt sich eine weitere Detektion
; nicht erreichen. Ergebnis:                   ok. 30.08.18
; 3. Ausbaustufe: Test der Interupts anhand der LED, rot
; Ergebnis: ok
; 4.Ausbaustufe: Endzustand komplett, mit Mosfet Si4463BDY
; Ergebnis:
; 
; ###########################################################
; Pinbelegung:
;
; GPI0	0 - GP0 Ausgang, nur ICSPDAT
;	1 - GP1 Ausgang, nur ICSPCLK
;	2 - GP2 Eingang, INT, steigende Flanke von PIR-OUT
;	3 - Vpp/MCLR
;	4 - GP4 Eingang, Meldeltg. v. Pi (Header Pin11/GPIO17)
;	5 - GP5 Ausgang, Gate T1 Mosfet Si4463
;
;	(Mosfet=Aus bei Gate=High)
;
; Prozessor-Takt 4 MHz, intern
; verwendete Platine: (Kalibrierwert OSCCAL!)
;
; Autor: Dipl.-Ing. Lothar Hiller
; ###########################################################
; Prozessor PIC12F675 (Fabrikzustand, Configuration: 01FF):
; PIC5:  OSCCAL: 3454, Bandgap: 1000, SMD, PIR, Bernh.
; PIC6:  OSCCAL: 3438, BandGap: 0000, SMD, PIR, Loth.
; PIC7:  OSCCAL: 3448, BandGap: 1000, DIL
; PIC8:  OSCCAL: 3430, BandGap: 1000, DIL, rosa
; PIC9:  OSCCAL: 3438, BandGap: 1000, DIL, lila
; PIC10: OSCCAL: 3450, BandGap: 0000, SMD, PIR_CTRL Bernh.
; ###########################################################
; Includedatei 12F675 einbinden:
	list       p=12f675
	#include   <P12f675.INC>
	ERRORLEVEL -302    ; SUPPRESS BANK SELECTION MESSAGES

; Configuration festlegen:
; MCLR ein, Power on Timer, kein WDT, int-Oscillator, 
; kein Brown out
	__CONFIG	_MCLRE_ON & _PWRTE_ON & _WDT_OFF & _INTRC_OSC_NOCLKOUT & _BODEN_OFF








; S2, Z59 ###################################################
; Variablen festlegen  (20h ... 5Fh):
; fuer Zeitverzoegerungen (UP'e in quarz_4MHz.asm)
miniteil	equ	0x20
miditeil	equ	0x21
maxiteil	equ	0x22
time0		equ	0x23
time1		equ	0x24
time2		equ	0x25
;
;
; ###########################################################
	org	0x00
	goto	PicInit		; PIC initialisieren
;
	org	0x04
				; fuer ISR, hier unbenutzt
;
	org	0x06
				; Initialisierung
PicInit
	; IO-Pins
	bcf	STATUS,RP0	; Bank0
	clrf	GPIO		; Init GPIOs
	movlw	0x07
	movwf	CMCON		; Comparator aus
	;
	; Ein/Ausgaenge und analog/digital festlegen (Bank1)
	bsf	STATUS,RP0	; Bank1
	clrf	ANSEL		; alles digital
	movlw	b'00010100'	; Eing.=1 oder Ausg.=0 festlegen:
	movwf	TRISIO		; Ausgang: GP0,1,5 Eingang: GP2,4
	;
	; OPTION_REG einstellen (Bank1)
	movlw	0xff
	movwf	OPTION_REG	; alle Bits auf high:
				; INTEDG=1 Int. bei steig. 
				; Flanke an GP2
				; PSA=1, fuer WDT unbenutzt
	;
	; internen Taktgenerator kalibrieren (Bank1)
	call	0x3FF
	movwf	OSCCAL		; 4-MHz-Kalibrierung
	bcf	STATUS,RP0	; Bank0
	;
	; Definitionen von Portpins:
;#define	PIROUT	GPIO,GP2	; pir-out an Eingang GP2
#define	RPIEA	GPIO,GP4	; Meldeleitung vom Raspi
#define	MOSEA	GPIO,GP5	; GP5 steuert gate p-Ch-Mosfet:
				; LOW=EIN, HIGH=AUS
	; GP5=1 ausgeben, damit T1 AUS ist !
	bsf	GPIO,GP5	; GP5=1, T1 AUS

	; PIR-Initialisierung abwarten:
	movlw	D'240'		; w = 240 (Dez)
	call	maxitime	; 240x250ms = 1 Min. warten
	movlw	D'240'
	call	maxitime	; noch eine Minute warten
;
; S3, Z118 ##################################################
Main
	; Zustand Z1 (PIC, GP2 ueberwacht PIR auf steig. Flanke)
	; Interruptbehandlung fuer Sleep:
	clrf	INTCON		; alle Int+Flags geloescht
	bsf	INTCON,INTE	; GP2/INT erlaubt, GIE=0 !
	SLEEP			; Sleep-Zustand aktivieren
	NOP
	clrf	INTCON		; alle INT sperren, INT-Flag=0
	;
	; PIR hat Bewegung detektiert, steigende Flanke an GP2
	; ### 4,7k von GP5 an GND:
	; Wenn GP2 kurz auf High geht (steigende Flanke), oder
	; pir-out=1, dann muss LED leuchten !
;	bsf	GPIO,GP5	; LED rot ein
	bcf	MOSEA		; MOSEA=0, Raspi ein
	; ab hier schaltet der Mosfet den Pi ein (GP5=LOW)
raspion
        ; Zustand Z2 (PIC, GP4 ueberwacht Pi auf steig. Flanke)
	clrf	INTCON		; alle Int+Flags geloescht
	bsf	STATUS,RP0	; Bank1
	bsf	IOC,IOC4	; IOC an GP4 vorbereiten
	bcf	STATUS,RP0	; Bank0
	bsf	INTCON,GPIE	; IOC erlauben
	SLEEP			; warten auf I-O-C
	NOP
	btfss	GPIO,GP4	; ist GP4=1, ueberspr. nae. Bef.
	goto	raspion		; GP4=0
	;
	; GP4=1, Pi ist heruntergefahren, kleine Warteschleife
        clrf	INTCON
        movlw   D'8'            ; w=8
        call    maxitime        ; 8x250ms = 2 Sek. warten
	;
	;Der Pi ist down, +5V abschalten
;	bcf	GPIO,GP5	; LED rot aus
	bsf	MOSEA		; MOSEA=1, Raspi aus
	; ab hier schaltet der Mosfet den Pi ab (GP5=HIGH)
	movlw	D'40'		; w = 40 (Dez)
	call	maxitime	; 40x250ms = 10 Sek. warten
	goto	Main
;
; ###########################################################
; ###########################################################
; INCLUDE von Hilfsprogrammen:
	#include <quarz_4MHz.asm>	; Zeitverzoeg.-UP'e
;
; ###########################################################
; Unterprogramme:
; ###########################################################
;
; ###########################################################
; Kalibrierwert des PIC12F675 auf Adresse 3FFH ablegen
; ###########################################################
	org	0x03FF
	retlw	0x50		; Wert v. PIC10,PIR_CTRL


; ###########################################################
	end
; Ende Datei pircontrol4.asm
