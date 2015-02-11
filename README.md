# kdraw
canvas-based signatures and photo annotation

uses jQuery.

simple example:
<script src="http://code.jquery.com/jquery-2.1.3.min.js"></script>
<script src="kdraw.min.js"></script>
<button id="signature"><input type="hidden" name="signature"/>Signature</button>
<script>
$('#signature').kdraw();
</script>

the recorded data will be placed in the contained <input/> in JSON format.
