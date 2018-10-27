Assembling and Flashing
=======================

We use `gpasm` as the assembler and `pk2cmd` as flashing tools for the
PIC12F675. Both are available for the Raspberry Pi. For the latter you
also need the flashing tool /PICkit2/, which you can buy for a few
bucks on eBay.

Assembling
----------

In `pircontrol4.asm` you have to change the value of `OSCCAL`
(specific to the chip you use). Afterwards run, the assembler

    $ gpasm -a inhx8m pircontrol4.asm
    pircontrol4.asm:45:Warning [231] found lower case match for include filename

This will (re) create the file `pircontrol4.hex`.

Flashing
--------

Attach your PIC12F675 to your PICkit2 and run

    $ sudo pk2cmd -P PIC12F675 -X -M -F pircontrol4.hex
    PICkit 2 Program Report
    19-10-2018, 17:19:23
    Device Type: PIC12F675

    Program Succeeded.

    Operation Succeeded

That should be it.

