setlocal
set LANG=en

::anura.exe --module=metroiduh --no-send-stats --no-tests
anura.exe --module=metroiduh --level=test-level.cfg --no-send-stats --no-tests

::pause

