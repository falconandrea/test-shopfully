<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Validator;

class CreativeImageRule implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if ($value instanceof UploadedFile) {
            // Validate standard file upload
            $validator = Validator::make(
                ['image' => $value],
                ['image' => 'image|mimes:jpeg,png|dimensions:width=320,height=480']
            );

            if ($validator->fails()) {
                $fail($validator->errors()->first('image'));
            }
        } elseif (is_string($value)) {
            // Validate base64 string
            if (! preg_match('/^data:image\/(jpeg|png|jpg);base64,/', $value)) {
                $fail('The image must be a valid base64 encoded string (jpeg or png).');

                return;
            }

            $data = base64_decode(substr($value, strpos($value, ',') + 1));
            $size = @getimagesizefromstring($data);

            if (! $size || $size[0] !== 320 || $size[1] !== 480) {
                $fail('The image must be exactly 320x480 pixels.');
            }
        } else {
            $fail('The image must be a file or a base64 string.');
        }
    }
}
