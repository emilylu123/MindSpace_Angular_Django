

from rest_framework import serializers

from core.models import Record, Insight, TriggerKeywordFrequency

class RecordSerializers(serializers.ModelSerializer):
    """Serializer for emotion records objects"""

    trigger_keyword_frequency = serializers.SerializerMethodField()

    def get_trigger_keyword_frequency(self, obj):
        keyword_freq_objects = TriggerKeywordFrequency.objects.filter(record=obj)
        return [{"keyword": x.keyword, "frequency": x.frequency} for x in keyword_freq_objects]

    class Meta:
        model = Record
        fields = ('id', 'emotion', 'posted_date', 'trigger_keyword_frequency','post')
        read_only_fields = ('id', 'trigger_keyword_frequency','post')


class InsightSerializers(serializers.ModelSerializer):
    """Serializer for insight records objects"""

    class Meta:
        model = Insight
        fields = ('id', 'reflection', 'posted_date', 'tag')
        read_only_fields = ('id', 'posted_date')