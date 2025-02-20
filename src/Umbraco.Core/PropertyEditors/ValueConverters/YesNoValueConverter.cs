using Umbraco.Cms.Core.Models.PublishedContent;

namespace Umbraco.Cms.Core.PropertyEditors.ValueConverters;

[DefaultPropertyValueConverter]
public class YesNoValueConverter : PropertyValueConverterBase
{
    public override bool IsConverter(IPublishedPropertyType propertyType)
        => propertyType.EditorAlias == Constants.PropertyEditors.Aliases.Boolean;

    public override Type GetPropertyValueType(IPublishedPropertyType propertyType)
        => typeof(bool);

    public override PropertyCacheLevel GetPropertyCacheLevel(IPublishedPropertyType propertyType)
        => PropertyCacheLevel.Element;

    public override object? ConvertSourceToIntermediate(IPublishedElement owner, IPublishedPropertyType propertyType, object? source, bool preview)
    {
        if (source is null)
        {
            return null;
        }

        // in xml a boolean is: string
        // in the database a boolean is: string "1" or "0" or empty
        // typically the converter does not need to handle anything else ("true"...)
        // however there are cases where the value passed to the converter could be a non-string object, e.g. int, bool
        if (source is string s)
        {
            if (s.Length == 0 || s == "0")
            {
                return false;
            }

            if (s == "1")
            {
                return true;
            }

            return bool.TryParse(s, out var result) && result;
        }

        if (source is int sourceAsInt)
        {
            return sourceAsInt == 1;
        }

        // this is required for correct true/false handling in nested content elements
        if (source is long sourceAsLong)
        {
            return sourceAsLong == 1;
        }

        if (source is bool sourceAsBoolean)
        {
            return sourceAsBoolean;
        }

        // false for any other value
        return false;
    }

    /// <inheritdoc />
    public override object? ConvertIntermediateToObject(IPublishedElement owner, IPublishedPropertyType propertyType, PropertyCacheLevel cacheLevel, object? source, bool preview)
    {
        // If source is null, whether we return true or false depends on the configured default value (initial state).
        if (source is null)
        {
            TrueFalseConfiguration? configuration = propertyType.DataType.ConfigurationAs<TrueFalseConfiguration>();
            return configuration?.InitialState ?? false;
        }

        return (bool)source;
    }
}
